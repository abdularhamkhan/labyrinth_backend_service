
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model PasswordResetToken
 * 
 */
export type PasswordResetToken = $Result.DefaultSelection<Prisma.$PasswordResetTokenPayload>
/**
 * Model UserSession
 * 
 */
export type UserSession = $Result.DefaultSelection<Prisma.$UserSessionPayload>
/**
 * Model Friendship
 * 
 */
export type Friendship = $Result.DefaultSelection<Prisma.$FriendshipPayload>
/**
 * Model GameSession
 * 
 */
export type GameSession = $Result.DefaultSelection<Prisma.$GameSessionPayload>
/**
 * Model GameParticipant
 * 
 */
export type GameParticipant = $Result.DefaultSelection<Prisma.$GameParticipantPayload>
/**
 * Model GameRound
 * 
 */
export type GameRound = $Result.DefaultSelection<Prisma.$GameRoundPayload>
/**
 * Model GameScore
 * 
 */
export type GameScore = $Result.DefaultSelection<Prisma.$GameScorePayload>
/**
 * Model DailyChallenge
 * 
 */
export type DailyChallenge = $Result.DefaultSelection<Prisma.$DailyChallengePayload>
/**
 * Model DailyChallengeAnswer
 * 
 */
export type DailyChallengeAnswer = $Result.DefaultSelection<Prisma.$DailyChallengeAnswerPayload>
/**
 * Model Leaderboard
 * 
 */
export type Leaderboard = $Result.DefaultSelection<Prisma.$LeaderboardPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const UserStatus: {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
  DELETED: 'DELETED'
};

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus]


export const FriendshipStatus: {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  BLOCKED: 'BLOCKED',
  REJECTED: 'REJECTED'
};

export type FriendshipStatus = (typeof FriendshipStatus)[keyof typeof FriendshipStatus]


export const GameType: {
  DAILY_CHALLENGE: 'DAILY_CHALLENGE',
  PVP_MATCH: 'PVP_MATCH',
  PVP_COMPUTER: 'PVP_COMPUTER',
  PRACTICE: 'PRACTICE'
};

export type GameType = (typeof GameType)[keyof typeof GameType]


export const GameStatus: {
  WAITING: 'WAITING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED'
};

export type GameStatus = (typeof GameStatus)[keyof typeof GameStatus]


export const SessionStatus: {
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
  TERMINATED: 'TERMINATED'
};

export type SessionStatus = (typeof SessionStatus)[keyof typeof SessionStatus]

}

export type UserStatus = $Enums.UserStatus

export const UserStatus: typeof $Enums.UserStatus

export type FriendshipStatus = $Enums.FriendshipStatus

export const FriendshipStatus: typeof $Enums.FriendshipStatus

export type GameType = $Enums.GameType

export const GameType: typeof $Enums.GameType

export type GameStatus = $Enums.GameStatus

export const GameStatus: typeof $Enums.GameStatus

export type SessionStatus = $Enums.SessionStatus

export const SessionStatus: typeof $Enums.SessionStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.passwordResetToken`: Exposes CRUD operations for the **PasswordResetToken** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PasswordResetTokens
    * const passwordResetTokens = await prisma.passwordResetToken.findMany()
    * ```
    */
  get passwordResetToken(): Prisma.PasswordResetTokenDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userSession`: Exposes CRUD operations for the **UserSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserSessions
    * const userSessions = await prisma.userSession.findMany()
    * ```
    */
  get userSession(): Prisma.UserSessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.friendship`: Exposes CRUD operations for the **Friendship** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Friendships
    * const friendships = await prisma.friendship.findMany()
    * ```
    */
  get friendship(): Prisma.FriendshipDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.gameSession`: Exposes CRUD operations for the **GameSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GameSessions
    * const gameSessions = await prisma.gameSession.findMany()
    * ```
    */
  get gameSession(): Prisma.GameSessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.gameParticipant`: Exposes CRUD operations for the **GameParticipant** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GameParticipants
    * const gameParticipants = await prisma.gameParticipant.findMany()
    * ```
    */
  get gameParticipant(): Prisma.GameParticipantDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.gameRound`: Exposes CRUD operations for the **GameRound** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GameRounds
    * const gameRounds = await prisma.gameRound.findMany()
    * ```
    */
  get gameRound(): Prisma.GameRoundDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.gameScore`: Exposes CRUD operations for the **GameScore** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GameScores
    * const gameScores = await prisma.gameScore.findMany()
    * ```
    */
  get gameScore(): Prisma.GameScoreDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.dailyChallenge`: Exposes CRUD operations for the **DailyChallenge** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DailyChallenges
    * const dailyChallenges = await prisma.dailyChallenge.findMany()
    * ```
    */
  get dailyChallenge(): Prisma.DailyChallengeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.dailyChallengeAnswer`: Exposes CRUD operations for the **DailyChallengeAnswer** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DailyChallengeAnswers
    * const dailyChallengeAnswers = await prisma.dailyChallengeAnswer.findMany()
    * ```
    */
  get dailyChallengeAnswer(): Prisma.DailyChallengeAnswerDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.leaderboard`: Exposes CRUD operations for the **Leaderboard** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Leaderboards
    * const leaderboards = await prisma.leaderboard.findMany()
    * ```
    */
  get leaderboard(): Prisma.LeaderboardDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.12.0
   * Query Engine version: 8047c96bbd92db98a2abc7c9323ce77c02c89dbc
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    PasswordResetToken: 'PasswordResetToken',
    UserSession: 'UserSession',
    Friendship: 'Friendship',
    GameSession: 'GameSession',
    GameParticipant: 'GameParticipant',
    GameRound: 'GameRound',
    GameScore: 'GameScore',
    DailyChallenge: 'DailyChallenge',
    DailyChallengeAnswer: 'DailyChallengeAnswer',
    Leaderboard: 'Leaderboard'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "passwordResetToken" | "userSession" | "friendship" | "gameSession" | "gameParticipant" | "gameRound" | "gameScore" | "dailyChallenge" | "dailyChallengeAnswer" | "leaderboard"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      PasswordResetToken: {
        payload: Prisma.$PasswordResetTokenPayload<ExtArgs>
        fields: Prisma.PasswordResetTokenFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PasswordResetTokenFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PasswordResetTokenFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>
          }
          findFirst: {
            args: Prisma.PasswordResetTokenFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PasswordResetTokenFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>
          }
          findMany: {
            args: Prisma.PasswordResetTokenFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>[]
          }
          create: {
            args: Prisma.PasswordResetTokenCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>
          }
          createMany: {
            args: Prisma.PasswordResetTokenCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PasswordResetTokenCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>[]
          }
          delete: {
            args: Prisma.PasswordResetTokenDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>
          }
          update: {
            args: Prisma.PasswordResetTokenUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>
          }
          deleteMany: {
            args: Prisma.PasswordResetTokenDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PasswordResetTokenUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PasswordResetTokenUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>[]
          }
          upsert: {
            args: Prisma.PasswordResetTokenUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PasswordResetTokenPayload>
          }
          aggregate: {
            args: Prisma.PasswordResetTokenAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePasswordResetToken>
          }
          groupBy: {
            args: Prisma.PasswordResetTokenGroupByArgs<ExtArgs>
            result: $Utils.Optional<PasswordResetTokenGroupByOutputType>[]
          }
          count: {
            args: Prisma.PasswordResetTokenCountArgs<ExtArgs>
            result: $Utils.Optional<PasswordResetTokenCountAggregateOutputType> | number
          }
        }
      }
      UserSession: {
        payload: Prisma.$UserSessionPayload<ExtArgs>
        fields: Prisma.UserSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>
          }
          findFirst: {
            args: Prisma.UserSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>
          }
          findMany: {
            args: Prisma.UserSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>[]
          }
          create: {
            args: Prisma.UserSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>
          }
          createMany: {
            args: Prisma.UserSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>[]
          }
          delete: {
            args: Prisma.UserSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>
          }
          update: {
            args: Prisma.UserSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>
          }
          deleteMany: {
            args: Prisma.UserSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserSessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>[]
          }
          upsert: {
            args: Prisma.UserSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserSessionPayload>
          }
          aggregate: {
            args: Prisma.UserSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserSession>
          }
          groupBy: {
            args: Prisma.UserSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserSessionCountArgs<ExtArgs>
            result: $Utils.Optional<UserSessionCountAggregateOutputType> | number
          }
        }
      }
      Friendship: {
        payload: Prisma.$FriendshipPayload<ExtArgs>
        fields: Prisma.FriendshipFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FriendshipFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FriendshipFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload>
          }
          findFirst: {
            args: Prisma.FriendshipFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FriendshipFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload>
          }
          findMany: {
            args: Prisma.FriendshipFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload>[]
          }
          create: {
            args: Prisma.FriendshipCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload>
          }
          createMany: {
            args: Prisma.FriendshipCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FriendshipCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload>[]
          }
          delete: {
            args: Prisma.FriendshipDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload>
          }
          update: {
            args: Prisma.FriendshipUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload>
          }
          deleteMany: {
            args: Prisma.FriendshipDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FriendshipUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FriendshipUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload>[]
          }
          upsert: {
            args: Prisma.FriendshipUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload>
          }
          aggregate: {
            args: Prisma.FriendshipAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFriendship>
          }
          groupBy: {
            args: Prisma.FriendshipGroupByArgs<ExtArgs>
            result: $Utils.Optional<FriendshipGroupByOutputType>[]
          }
          count: {
            args: Prisma.FriendshipCountArgs<ExtArgs>
            result: $Utils.Optional<FriendshipCountAggregateOutputType> | number
          }
        }
      }
      GameSession: {
        payload: Prisma.$GameSessionPayload<ExtArgs>
        fields: Prisma.GameSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GameSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GameSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionPayload>
          }
          findFirst: {
            args: Prisma.GameSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GameSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionPayload>
          }
          findMany: {
            args: Prisma.GameSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionPayload>[]
          }
          create: {
            args: Prisma.GameSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionPayload>
          }
          createMany: {
            args: Prisma.GameSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GameSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionPayload>[]
          }
          delete: {
            args: Prisma.GameSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionPayload>
          }
          update: {
            args: Prisma.GameSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionPayload>
          }
          deleteMany: {
            args: Prisma.GameSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GameSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GameSessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionPayload>[]
          }
          upsert: {
            args: Prisma.GameSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameSessionPayload>
          }
          aggregate: {
            args: Prisma.GameSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGameSession>
          }
          groupBy: {
            args: Prisma.GameSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<GameSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.GameSessionCountArgs<ExtArgs>
            result: $Utils.Optional<GameSessionCountAggregateOutputType> | number
          }
        }
      }
      GameParticipant: {
        payload: Prisma.$GameParticipantPayload<ExtArgs>
        fields: Prisma.GameParticipantFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GameParticipantFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameParticipantPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GameParticipantFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameParticipantPayload>
          }
          findFirst: {
            args: Prisma.GameParticipantFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameParticipantPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GameParticipantFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameParticipantPayload>
          }
          findMany: {
            args: Prisma.GameParticipantFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameParticipantPayload>[]
          }
          create: {
            args: Prisma.GameParticipantCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameParticipantPayload>
          }
          createMany: {
            args: Prisma.GameParticipantCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GameParticipantCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameParticipantPayload>[]
          }
          delete: {
            args: Prisma.GameParticipantDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameParticipantPayload>
          }
          update: {
            args: Prisma.GameParticipantUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameParticipantPayload>
          }
          deleteMany: {
            args: Prisma.GameParticipantDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GameParticipantUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GameParticipantUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameParticipantPayload>[]
          }
          upsert: {
            args: Prisma.GameParticipantUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameParticipantPayload>
          }
          aggregate: {
            args: Prisma.GameParticipantAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGameParticipant>
          }
          groupBy: {
            args: Prisma.GameParticipantGroupByArgs<ExtArgs>
            result: $Utils.Optional<GameParticipantGroupByOutputType>[]
          }
          count: {
            args: Prisma.GameParticipantCountArgs<ExtArgs>
            result: $Utils.Optional<GameParticipantCountAggregateOutputType> | number
          }
        }
      }
      GameRound: {
        payload: Prisma.$GameRoundPayload<ExtArgs>
        fields: Prisma.GameRoundFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GameRoundFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameRoundPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GameRoundFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameRoundPayload>
          }
          findFirst: {
            args: Prisma.GameRoundFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameRoundPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GameRoundFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameRoundPayload>
          }
          findMany: {
            args: Prisma.GameRoundFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameRoundPayload>[]
          }
          create: {
            args: Prisma.GameRoundCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameRoundPayload>
          }
          createMany: {
            args: Prisma.GameRoundCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GameRoundCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameRoundPayload>[]
          }
          delete: {
            args: Prisma.GameRoundDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameRoundPayload>
          }
          update: {
            args: Prisma.GameRoundUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameRoundPayload>
          }
          deleteMany: {
            args: Prisma.GameRoundDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GameRoundUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GameRoundUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameRoundPayload>[]
          }
          upsert: {
            args: Prisma.GameRoundUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameRoundPayload>
          }
          aggregate: {
            args: Prisma.GameRoundAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGameRound>
          }
          groupBy: {
            args: Prisma.GameRoundGroupByArgs<ExtArgs>
            result: $Utils.Optional<GameRoundGroupByOutputType>[]
          }
          count: {
            args: Prisma.GameRoundCountArgs<ExtArgs>
            result: $Utils.Optional<GameRoundCountAggregateOutputType> | number
          }
        }
      }
      GameScore: {
        payload: Prisma.$GameScorePayload<ExtArgs>
        fields: Prisma.GameScoreFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GameScoreFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameScorePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GameScoreFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameScorePayload>
          }
          findFirst: {
            args: Prisma.GameScoreFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameScorePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GameScoreFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameScorePayload>
          }
          findMany: {
            args: Prisma.GameScoreFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameScorePayload>[]
          }
          create: {
            args: Prisma.GameScoreCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameScorePayload>
          }
          createMany: {
            args: Prisma.GameScoreCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GameScoreCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameScorePayload>[]
          }
          delete: {
            args: Prisma.GameScoreDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameScorePayload>
          }
          update: {
            args: Prisma.GameScoreUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameScorePayload>
          }
          deleteMany: {
            args: Prisma.GameScoreDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GameScoreUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GameScoreUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameScorePayload>[]
          }
          upsert: {
            args: Prisma.GameScoreUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GameScorePayload>
          }
          aggregate: {
            args: Prisma.GameScoreAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGameScore>
          }
          groupBy: {
            args: Prisma.GameScoreGroupByArgs<ExtArgs>
            result: $Utils.Optional<GameScoreGroupByOutputType>[]
          }
          count: {
            args: Prisma.GameScoreCountArgs<ExtArgs>
            result: $Utils.Optional<GameScoreCountAggregateOutputType> | number
          }
        }
      }
      DailyChallenge: {
        payload: Prisma.$DailyChallengePayload<ExtArgs>
        fields: Prisma.DailyChallengeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DailyChallengeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyChallengePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DailyChallengeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyChallengePayload>
          }
          findFirst: {
            args: Prisma.DailyChallengeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyChallengePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DailyChallengeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyChallengePayload>
          }
          findMany: {
            args: Prisma.DailyChallengeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyChallengePayload>[]
          }
          create: {
            args: Prisma.DailyChallengeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyChallengePayload>
          }
          createMany: {
            args: Prisma.DailyChallengeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DailyChallengeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyChallengePayload>[]
          }
          delete: {
            args: Prisma.DailyChallengeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyChallengePayload>
          }
          update: {
            args: Prisma.DailyChallengeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyChallengePayload>
          }
          deleteMany: {
            args: Prisma.DailyChallengeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DailyChallengeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DailyChallengeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyChallengePayload>[]
          }
          upsert: {
            args: Prisma.DailyChallengeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyChallengePayload>
          }
          aggregate: {
            args: Prisma.DailyChallengeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDailyChallenge>
          }
          groupBy: {
            args: Prisma.DailyChallengeGroupByArgs<ExtArgs>
            result: $Utils.Optional<DailyChallengeGroupByOutputType>[]
          }
          count: {
            args: Prisma.DailyChallengeCountArgs<ExtArgs>
            result: $Utils.Optional<DailyChallengeCountAggregateOutputType> | number
          }
        }
      }
      DailyChallengeAnswer: {
        payload: Prisma.$DailyChallengeAnswerPayload<ExtArgs>
        fields: Prisma.DailyChallengeAnswerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DailyChallengeAnswerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyChallengeAnswerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DailyChallengeAnswerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyChallengeAnswerPayload>
          }
          findFirst: {
            args: Prisma.DailyChallengeAnswerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyChallengeAnswerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DailyChallengeAnswerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyChallengeAnswerPayload>
          }
          findMany: {
            args: Prisma.DailyChallengeAnswerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyChallengeAnswerPayload>[]
          }
          create: {
            args: Prisma.DailyChallengeAnswerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyChallengeAnswerPayload>
          }
          createMany: {
            args: Prisma.DailyChallengeAnswerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DailyChallengeAnswerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyChallengeAnswerPayload>[]
          }
          delete: {
            args: Prisma.DailyChallengeAnswerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyChallengeAnswerPayload>
          }
          update: {
            args: Prisma.DailyChallengeAnswerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyChallengeAnswerPayload>
          }
          deleteMany: {
            args: Prisma.DailyChallengeAnswerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DailyChallengeAnswerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DailyChallengeAnswerUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyChallengeAnswerPayload>[]
          }
          upsert: {
            args: Prisma.DailyChallengeAnswerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DailyChallengeAnswerPayload>
          }
          aggregate: {
            args: Prisma.DailyChallengeAnswerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDailyChallengeAnswer>
          }
          groupBy: {
            args: Prisma.DailyChallengeAnswerGroupByArgs<ExtArgs>
            result: $Utils.Optional<DailyChallengeAnswerGroupByOutputType>[]
          }
          count: {
            args: Prisma.DailyChallengeAnswerCountArgs<ExtArgs>
            result: $Utils.Optional<DailyChallengeAnswerCountAggregateOutputType> | number
          }
        }
      }
      Leaderboard: {
        payload: Prisma.$LeaderboardPayload<ExtArgs>
        fields: Prisma.LeaderboardFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LeaderboardFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaderboardPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LeaderboardFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaderboardPayload>
          }
          findFirst: {
            args: Prisma.LeaderboardFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaderboardPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LeaderboardFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaderboardPayload>
          }
          findMany: {
            args: Prisma.LeaderboardFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaderboardPayload>[]
          }
          create: {
            args: Prisma.LeaderboardCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaderboardPayload>
          }
          createMany: {
            args: Prisma.LeaderboardCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LeaderboardCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaderboardPayload>[]
          }
          delete: {
            args: Prisma.LeaderboardDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaderboardPayload>
          }
          update: {
            args: Prisma.LeaderboardUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaderboardPayload>
          }
          deleteMany: {
            args: Prisma.LeaderboardDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LeaderboardUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LeaderboardUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaderboardPayload>[]
          }
          upsert: {
            args: Prisma.LeaderboardUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaderboardPayload>
          }
          aggregate: {
            args: Prisma.LeaderboardAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLeaderboard>
          }
          groupBy: {
            args: Prisma.LeaderboardGroupByArgs<ExtArgs>
            result: $Utils.Optional<LeaderboardGroupByOutputType>[]
          }
          count: {
            args: Prisma.LeaderboardCountArgs<ExtArgs>
            result: $Utils.Optional<LeaderboardCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    passwordResetToken?: PasswordResetTokenOmit
    userSession?: UserSessionOmit
    friendship?: FriendshipOmit
    gameSession?: GameSessionOmit
    gameParticipant?: GameParticipantOmit
    gameRound?: GameRoundOmit
    gameScore?: GameScoreOmit
    dailyChallenge?: DailyChallengeOmit
    dailyChallengeAnswer?: DailyChallengeAnswerOmit
    leaderboard?: LeaderboardOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    sessions: number
    passwordResetTokens: number
    sentFriendRequests: number
    receivedFriendRequests: number
    gameParticipations: number
    dailyChallengeAnswers: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs
    passwordResetTokens?: boolean | UserCountOutputTypeCountPasswordResetTokensArgs
    sentFriendRequests?: boolean | UserCountOutputTypeCountSentFriendRequestsArgs
    receivedFriendRequests?: boolean | UserCountOutputTypeCountReceivedFriendRequestsArgs
    gameParticipations?: boolean | UserCountOutputTypeCountGameParticipationsArgs
    dailyChallengeAnswers?: boolean | UserCountOutputTypeCountDailyChallengeAnswersArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserSessionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPasswordResetTokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PasswordResetTokenWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSentFriendRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FriendshipWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountReceivedFriendRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FriendshipWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountGameParticipationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameParticipantWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountDailyChallengeAnswersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DailyChallengeAnswerWhereInput
  }


  /**
   * Count Type GameSessionCountOutputType
   */

  export type GameSessionCountOutputType = {
    participants: number
    rounds: number
  }

  export type GameSessionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    participants?: boolean | GameSessionCountOutputTypeCountParticipantsArgs
    rounds?: boolean | GameSessionCountOutputTypeCountRoundsArgs
  }

  // Custom InputTypes
  /**
   * GameSessionCountOutputType without action
   */
  export type GameSessionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSessionCountOutputType
     */
    select?: GameSessionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * GameSessionCountOutputType without action
   */
  export type GameSessionCountOutputTypeCountParticipantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameParticipantWhereInput
  }

  /**
   * GameSessionCountOutputType without action
   */
  export type GameSessionCountOutputTypeCountRoundsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameRoundWhereInput
  }


  /**
   * Count Type GameParticipantCountOutputType
   */

  export type GameParticipantCountOutputType = {
    scores: number
  }

  export type GameParticipantCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    scores?: boolean | GameParticipantCountOutputTypeCountScoresArgs
  }

  // Custom InputTypes
  /**
   * GameParticipantCountOutputType without action
   */
  export type GameParticipantCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameParticipantCountOutputType
     */
    select?: GameParticipantCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * GameParticipantCountOutputType without action
   */
  export type GameParticipantCountOutputTypeCountScoresArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameScoreWhereInput
  }


  /**
   * Count Type GameRoundCountOutputType
   */

  export type GameRoundCountOutputType = {
    scores: number
  }

  export type GameRoundCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    scores?: boolean | GameRoundCountOutputTypeCountScoresArgs
  }

  // Custom InputTypes
  /**
   * GameRoundCountOutputType without action
   */
  export type GameRoundCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRoundCountOutputType
     */
    select?: GameRoundCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * GameRoundCountOutputType without action
   */
  export type GameRoundCountOutputTypeCountScoresArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameScoreWhereInput
  }


  /**
   * Count Type DailyChallengeCountOutputType
   */

  export type DailyChallengeCountOutputType = {
    answers: number
  }

  export type DailyChallengeCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    answers?: boolean | DailyChallengeCountOutputTypeCountAnswersArgs
  }

  // Custom InputTypes
  /**
   * DailyChallengeCountOutputType without action
   */
  export type DailyChallengeCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyChallengeCountOutputType
     */
    select?: DailyChallengeCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DailyChallengeCountOutputType without action
   */
  export type DailyChallengeCountOutputTypeCountAnswersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DailyChallengeAnswerWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    totalScore: number | null
    gamesPlayed: number | null
    gamesWon: number | null
    winRate: number | null
    currentStreak: number | null
    bestStreak: number | null
  }

  export type UserSumAggregateOutputType = {
    totalScore: number | null
    gamesPlayed: number | null
    gamesWon: number | null
    winRate: number | null
    currentStreak: number | null
    bestStreak: number | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    username: string | null
    firstName: string | null
    lastName: string | null
    phone: string | null
    avatar: string | null
    status: $Enums.UserStatus | null
    totalScore: number | null
    gamesPlayed: number | null
    gamesWon: number | null
    winRate: number | null
    currentStreak: number | null
    bestStreak: number | null
    lastActive: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    username: string | null
    firstName: string | null
    lastName: string | null
    phone: string | null
    avatar: string | null
    status: $Enums.UserStatus | null
    totalScore: number | null
    gamesPlayed: number | null
    gamesWon: number | null
    winRate: number | null
    currentStreak: number | null
    bestStreak: number | null
    lastActive: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    username: number
    firstName: number
    lastName: number
    phone: number
    avatar: number
    status: number
    totalScore: number
    gamesPlayed: number
    gamesWon: number
    winRate: number
    currentStreak: number
    bestStreak: number
    lastActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    totalScore?: true
    gamesPlayed?: true
    gamesWon?: true
    winRate?: true
    currentStreak?: true
    bestStreak?: true
  }

  export type UserSumAggregateInputType = {
    totalScore?: true
    gamesPlayed?: true
    gamesWon?: true
    winRate?: true
    currentStreak?: true
    bestStreak?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    username?: true
    firstName?: true
    lastName?: true
    phone?: true
    avatar?: true
    status?: true
    totalScore?: true
    gamesPlayed?: true
    gamesWon?: true
    winRate?: true
    currentStreak?: true
    bestStreak?: true
    lastActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    username?: true
    firstName?: true
    lastName?: true
    phone?: true
    avatar?: true
    status?: true
    totalScore?: true
    gamesPlayed?: true
    gamesWon?: true
    winRate?: true
    currentStreak?: true
    bestStreak?: true
    lastActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    username?: true
    firstName?: true
    lastName?: true
    phone?: true
    avatar?: true
    status?: true
    totalScore?: true
    gamesPlayed?: true
    gamesWon?: true
    winRate?: true
    currentStreak?: true
    bestStreak?: true
    lastActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    username: string
    firstName: string
    lastName: string
    phone: string | null
    avatar: string | null
    status: $Enums.UserStatus
    totalScore: number
    gamesPlayed: number
    gamesWon: number
    winRate: number
    currentStreak: number
    bestStreak: number
    lastActive: Date | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    username?: boolean
    firstName?: boolean
    lastName?: boolean
    phone?: boolean
    avatar?: boolean
    status?: boolean
    totalScore?: boolean
    gamesPlayed?: boolean
    gamesWon?: boolean
    winRate?: boolean
    currentStreak?: boolean
    bestStreak?: boolean
    lastActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    passwordResetTokens?: boolean | User$passwordResetTokensArgs<ExtArgs>
    sentFriendRequests?: boolean | User$sentFriendRequestsArgs<ExtArgs>
    receivedFriendRequests?: boolean | User$receivedFriendRequestsArgs<ExtArgs>
    gameParticipations?: boolean | User$gameParticipationsArgs<ExtArgs>
    dailyChallengeAnswers?: boolean | User$dailyChallengeAnswersArgs<ExtArgs>
    leaderboardEntry?: boolean | User$leaderboardEntryArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    username?: boolean
    firstName?: boolean
    lastName?: boolean
    phone?: boolean
    avatar?: boolean
    status?: boolean
    totalScore?: boolean
    gamesPlayed?: boolean
    gamesWon?: boolean
    winRate?: boolean
    currentStreak?: boolean
    bestStreak?: boolean
    lastActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    username?: boolean
    firstName?: boolean
    lastName?: boolean
    phone?: boolean
    avatar?: boolean
    status?: boolean
    totalScore?: boolean
    gamesPlayed?: boolean
    gamesWon?: boolean
    winRate?: boolean
    currentStreak?: boolean
    bestStreak?: boolean
    lastActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    username?: boolean
    firstName?: boolean
    lastName?: boolean
    phone?: boolean
    avatar?: boolean
    status?: boolean
    totalScore?: boolean
    gamesPlayed?: boolean
    gamesWon?: boolean
    winRate?: boolean
    currentStreak?: boolean
    bestStreak?: boolean
    lastActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "username" | "firstName" | "lastName" | "phone" | "avatar" | "status" | "totalScore" | "gamesPlayed" | "gamesWon" | "winRate" | "currentStreak" | "bestStreak" | "lastActive" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sessions?: boolean | User$sessionsArgs<ExtArgs>
    passwordResetTokens?: boolean | User$passwordResetTokensArgs<ExtArgs>
    sentFriendRequests?: boolean | User$sentFriendRequestsArgs<ExtArgs>
    receivedFriendRequests?: boolean | User$receivedFriendRequestsArgs<ExtArgs>
    gameParticipations?: boolean | User$gameParticipationsArgs<ExtArgs>
    dailyChallengeAnswers?: boolean | User$dailyChallengeAnswersArgs<ExtArgs>
    leaderboardEntry?: boolean | User$leaderboardEntryArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      sessions: Prisma.$UserSessionPayload<ExtArgs>[]
      passwordResetTokens: Prisma.$PasswordResetTokenPayload<ExtArgs>[]
      sentFriendRequests: Prisma.$FriendshipPayload<ExtArgs>[]
      receivedFriendRequests: Prisma.$FriendshipPayload<ExtArgs>[]
      gameParticipations: Prisma.$GameParticipantPayload<ExtArgs>[]
      dailyChallengeAnswers: Prisma.$DailyChallengeAnswerPayload<ExtArgs>[]
      leaderboardEntry: Prisma.$LeaderboardPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      username: string
      firstName: string
      lastName: string
      phone: string | null
      avatar: string | null
      status: $Enums.UserStatus
      totalScore: number
      gamesPlayed: number
      gamesWon: number
      winRate: number
      currentStreak: number
      bestStreak: number
      lastActive: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sessions<T extends User$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    passwordResetTokens<T extends User$passwordResetTokensArgs<ExtArgs> = {}>(args?: Subset<T, User$passwordResetTokensArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sentFriendRequests<T extends User$sentFriendRequestsArgs<ExtArgs> = {}>(args?: Subset<T, User$sentFriendRequestsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    receivedFriendRequests<T extends User$receivedFriendRequestsArgs<ExtArgs> = {}>(args?: Subset<T, User$receivedFriendRequestsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    gameParticipations<T extends User$gameParticipationsArgs<ExtArgs> = {}>(args?: Subset<T, User$gameParticipationsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameParticipantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    dailyChallengeAnswers<T extends User$dailyChallengeAnswersArgs<ExtArgs> = {}>(args?: Subset<T, User$dailyChallengeAnswersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DailyChallengeAnswerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    leaderboardEntry<T extends User$leaderboardEntryArgs<ExtArgs> = {}>(args?: Subset<T, User$leaderboardEntryArgs<ExtArgs>>): Prisma__LeaderboardClient<$Result.GetResult<Prisma.$LeaderboardPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly username: FieldRef<"User", 'String'>
    readonly firstName: FieldRef<"User", 'String'>
    readonly lastName: FieldRef<"User", 'String'>
    readonly phone: FieldRef<"User", 'String'>
    readonly avatar: FieldRef<"User", 'String'>
    readonly status: FieldRef<"User", 'UserStatus'>
    readonly totalScore: FieldRef<"User", 'Int'>
    readonly gamesPlayed: FieldRef<"User", 'Int'>
    readonly gamesWon: FieldRef<"User", 'Int'>
    readonly winRate: FieldRef<"User", 'Float'>
    readonly currentStreak: FieldRef<"User", 'Int'>
    readonly bestStreak: FieldRef<"User", 'Int'>
    readonly lastActive: FieldRef<"User", 'DateTime'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.sessions
   */
  export type User$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    where?: UserSessionWhereInput
    orderBy?: UserSessionOrderByWithRelationInput | UserSessionOrderByWithRelationInput[]
    cursor?: UserSessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserSessionScalarFieldEnum | UserSessionScalarFieldEnum[]
  }

  /**
   * User.passwordResetTokens
   */
  export type User$passwordResetTokensArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null
    where?: PasswordResetTokenWhereInput
    orderBy?: PasswordResetTokenOrderByWithRelationInput | PasswordResetTokenOrderByWithRelationInput[]
    cursor?: PasswordResetTokenWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PasswordResetTokenScalarFieldEnum | PasswordResetTokenScalarFieldEnum[]
  }

  /**
   * User.sentFriendRequests
   */
  export type User$sentFriendRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipInclude<ExtArgs> | null
    where?: FriendshipWhereInput
    orderBy?: FriendshipOrderByWithRelationInput | FriendshipOrderByWithRelationInput[]
    cursor?: FriendshipWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FriendshipScalarFieldEnum | FriendshipScalarFieldEnum[]
  }

  /**
   * User.receivedFriendRequests
   */
  export type User$receivedFriendRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipInclude<ExtArgs> | null
    where?: FriendshipWhereInput
    orderBy?: FriendshipOrderByWithRelationInput | FriendshipOrderByWithRelationInput[]
    cursor?: FriendshipWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FriendshipScalarFieldEnum | FriendshipScalarFieldEnum[]
  }

  /**
   * User.gameParticipations
   */
  export type User$gameParticipationsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameParticipant
     */
    select?: GameParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameParticipant
     */
    omit?: GameParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameParticipantInclude<ExtArgs> | null
    where?: GameParticipantWhereInput
    orderBy?: GameParticipantOrderByWithRelationInput | GameParticipantOrderByWithRelationInput[]
    cursor?: GameParticipantWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GameParticipantScalarFieldEnum | GameParticipantScalarFieldEnum[]
  }

  /**
   * User.dailyChallengeAnswers
   */
  export type User$dailyChallengeAnswersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyChallengeAnswer
     */
    select?: DailyChallengeAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyChallengeAnswer
     */
    omit?: DailyChallengeAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyChallengeAnswerInclude<ExtArgs> | null
    where?: DailyChallengeAnswerWhereInput
    orderBy?: DailyChallengeAnswerOrderByWithRelationInput | DailyChallengeAnswerOrderByWithRelationInput[]
    cursor?: DailyChallengeAnswerWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DailyChallengeAnswerScalarFieldEnum | DailyChallengeAnswerScalarFieldEnum[]
  }

  /**
   * User.leaderboardEntry
   */
  export type User$leaderboardEntryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Leaderboard
     */
    select?: LeaderboardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Leaderboard
     */
    omit?: LeaderboardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaderboardInclude<ExtArgs> | null
    where?: LeaderboardWhereInput
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model PasswordResetToken
   */

  export type AggregatePasswordResetToken = {
    _count: PasswordResetTokenCountAggregateOutputType | null
    _min: PasswordResetTokenMinAggregateOutputType | null
    _max: PasswordResetTokenMaxAggregateOutputType | null
  }

  export type PasswordResetTokenMinAggregateOutputType = {
    id: string | null
    userId: string | null
    token: string | null
    expiresAt: Date | null
    used: boolean | null
    createdAt: Date | null
    usedAt: Date | null
  }

  export type PasswordResetTokenMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    token: string | null
    expiresAt: Date | null
    used: boolean | null
    createdAt: Date | null
    usedAt: Date | null
  }

  export type PasswordResetTokenCountAggregateOutputType = {
    id: number
    userId: number
    token: number
    expiresAt: number
    used: number
    createdAt: number
    usedAt: number
    _all: number
  }


  export type PasswordResetTokenMinAggregateInputType = {
    id?: true
    userId?: true
    token?: true
    expiresAt?: true
    used?: true
    createdAt?: true
    usedAt?: true
  }

  export type PasswordResetTokenMaxAggregateInputType = {
    id?: true
    userId?: true
    token?: true
    expiresAt?: true
    used?: true
    createdAt?: true
    usedAt?: true
  }

  export type PasswordResetTokenCountAggregateInputType = {
    id?: true
    userId?: true
    token?: true
    expiresAt?: true
    used?: true
    createdAt?: true
    usedAt?: true
    _all?: true
  }

  export type PasswordResetTokenAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PasswordResetToken to aggregate.
     */
    where?: PasswordResetTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResetTokens to fetch.
     */
    orderBy?: PasswordResetTokenOrderByWithRelationInput | PasswordResetTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PasswordResetTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResetTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResetTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PasswordResetTokens
    **/
    _count?: true | PasswordResetTokenCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PasswordResetTokenMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PasswordResetTokenMaxAggregateInputType
  }

  export type GetPasswordResetTokenAggregateType<T extends PasswordResetTokenAggregateArgs> = {
        [P in keyof T & keyof AggregatePasswordResetToken]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePasswordResetToken[P]>
      : GetScalarType<T[P], AggregatePasswordResetToken[P]>
  }




  export type PasswordResetTokenGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PasswordResetTokenWhereInput
    orderBy?: PasswordResetTokenOrderByWithAggregationInput | PasswordResetTokenOrderByWithAggregationInput[]
    by: PasswordResetTokenScalarFieldEnum[] | PasswordResetTokenScalarFieldEnum
    having?: PasswordResetTokenScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PasswordResetTokenCountAggregateInputType | true
    _min?: PasswordResetTokenMinAggregateInputType
    _max?: PasswordResetTokenMaxAggregateInputType
  }

  export type PasswordResetTokenGroupByOutputType = {
    id: string
    userId: string
    token: string
    expiresAt: Date
    used: boolean
    createdAt: Date
    usedAt: Date | null
    _count: PasswordResetTokenCountAggregateOutputType | null
    _min: PasswordResetTokenMinAggregateOutputType | null
    _max: PasswordResetTokenMaxAggregateOutputType | null
  }

  type GetPasswordResetTokenGroupByPayload<T extends PasswordResetTokenGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PasswordResetTokenGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PasswordResetTokenGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PasswordResetTokenGroupByOutputType[P]>
            : GetScalarType<T[P], PasswordResetTokenGroupByOutputType[P]>
        }
      >
    >


  export type PasswordResetTokenSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    token?: boolean
    expiresAt?: boolean
    used?: boolean
    createdAt?: boolean
    usedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["passwordResetToken"]>

  export type PasswordResetTokenSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    token?: boolean
    expiresAt?: boolean
    used?: boolean
    createdAt?: boolean
    usedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["passwordResetToken"]>

  export type PasswordResetTokenSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    token?: boolean
    expiresAt?: boolean
    used?: boolean
    createdAt?: boolean
    usedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["passwordResetToken"]>

  export type PasswordResetTokenSelectScalar = {
    id?: boolean
    userId?: boolean
    token?: boolean
    expiresAt?: boolean
    used?: boolean
    createdAt?: boolean
    usedAt?: boolean
  }

  export type PasswordResetTokenOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "token" | "expiresAt" | "used" | "createdAt" | "usedAt", ExtArgs["result"]["passwordResetToken"]>
  export type PasswordResetTokenInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PasswordResetTokenIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PasswordResetTokenIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $PasswordResetTokenPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PasswordResetToken"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      token: string
      expiresAt: Date
      used: boolean
      createdAt: Date
      usedAt: Date | null
    }, ExtArgs["result"]["passwordResetToken"]>
    composites: {}
  }

  type PasswordResetTokenGetPayload<S extends boolean | null | undefined | PasswordResetTokenDefaultArgs> = $Result.GetResult<Prisma.$PasswordResetTokenPayload, S>

  type PasswordResetTokenCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PasswordResetTokenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PasswordResetTokenCountAggregateInputType | true
    }

  export interface PasswordResetTokenDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PasswordResetToken'], meta: { name: 'PasswordResetToken' } }
    /**
     * Find zero or one PasswordResetToken that matches the filter.
     * @param {PasswordResetTokenFindUniqueArgs} args - Arguments to find a PasswordResetToken
     * @example
     * // Get one PasswordResetToken
     * const passwordResetToken = await prisma.passwordResetToken.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PasswordResetTokenFindUniqueArgs>(args: SelectSubset<T, PasswordResetTokenFindUniqueArgs<ExtArgs>>): Prisma__PasswordResetTokenClient<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PasswordResetToken that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PasswordResetTokenFindUniqueOrThrowArgs} args - Arguments to find a PasswordResetToken
     * @example
     * // Get one PasswordResetToken
     * const passwordResetToken = await prisma.passwordResetToken.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PasswordResetTokenFindUniqueOrThrowArgs>(args: SelectSubset<T, PasswordResetTokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PasswordResetTokenClient<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PasswordResetToken that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetTokenFindFirstArgs} args - Arguments to find a PasswordResetToken
     * @example
     * // Get one PasswordResetToken
     * const passwordResetToken = await prisma.passwordResetToken.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PasswordResetTokenFindFirstArgs>(args?: SelectSubset<T, PasswordResetTokenFindFirstArgs<ExtArgs>>): Prisma__PasswordResetTokenClient<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PasswordResetToken that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetTokenFindFirstOrThrowArgs} args - Arguments to find a PasswordResetToken
     * @example
     * // Get one PasswordResetToken
     * const passwordResetToken = await prisma.passwordResetToken.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PasswordResetTokenFindFirstOrThrowArgs>(args?: SelectSubset<T, PasswordResetTokenFindFirstOrThrowArgs<ExtArgs>>): Prisma__PasswordResetTokenClient<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PasswordResetTokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetTokenFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PasswordResetTokens
     * const passwordResetTokens = await prisma.passwordResetToken.findMany()
     * 
     * // Get first 10 PasswordResetTokens
     * const passwordResetTokens = await prisma.passwordResetToken.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const passwordResetTokenWithIdOnly = await prisma.passwordResetToken.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PasswordResetTokenFindManyArgs>(args?: SelectSubset<T, PasswordResetTokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PasswordResetToken.
     * @param {PasswordResetTokenCreateArgs} args - Arguments to create a PasswordResetToken.
     * @example
     * // Create one PasswordResetToken
     * const PasswordResetToken = await prisma.passwordResetToken.create({
     *   data: {
     *     // ... data to create a PasswordResetToken
     *   }
     * })
     * 
     */
    create<T extends PasswordResetTokenCreateArgs>(args: SelectSubset<T, PasswordResetTokenCreateArgs<ExtArgs>>): Prisma__PasswordResetTokenClient<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PasswordResetTokens.
     * @param {PasswordResetTokenCreateManyArgs} args - Arguments to create many PasswordResetTokens.
     * @example
     * // Create many PasswordResetTokens
     * const passwordResetToken = await prisma.passwordResetToken.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PasswordResetTokenCreateManyArgs>(args?: SelectSubset<T, PasswordResetTokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PasswordResetTokens and returns the data saved in the database.
     * @param {PasswordResetTokenCreateManyAndReturnArgs} args - Arguments to create many PasswordResetTokens.
     * @example
     * // Create many PasswordResetTokens
     * const passwordResetToken = await prisma.passwordResetToken.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PasswordResetTokens and only return the `id`
     * const passwordResetTokenWithIdOnly = await prisma.passwordResetToken.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PasswordResetTokenCreateManyAndReturnArgs>(args?: SelectSubset<T, PasswordResetTokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PasswordResetToken.
     * @param {PasswordResetTokenDeleteArgs} args - Arguments to delete one PasswordResetToken.
     * @example
     * // Delete one PasswordResetToken
     * const PasswordResetToken = await prisma.passwordResetToken.delete({
     *   where: {
     *     // ... filter to delete one PasswordResetToken
     *   }
     * })
     * 
     */
    delete<T extends PasswordResetTokenDeleteArgs>(args: SelectSubset<T, PasswordResetTokenDeleteArgs<ExtArgs>>): Prisma__PasswordResetTokenClient<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PasswordResetToken.
     * @param {PasswordResetTokenUpdateArgs} args - Arguments to update one PasswordResetToken.
     * @example
     * // Update one PasswordResetToken
     * const passwordResetToken = await prisma.passwordResetToken.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PasswordResetTokenUpdateArgs>(args: SelectSubset<T, PasswordResetTokenUpdateArgs<ExtArgs>>): Prisma__PasswordResetTokenClient<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PasswordResetTokens.
     * @param {PasswordResetTokenDeleteManyArgs} args - Arguments to filter PasswordResetTokens to delete.
     * @example
     * // Delete a few PasswordResetTokens
     * const { count } = await prisma.passwordResetToken.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PasswordResetTokenDeleteManyArgs>(args?: SelectSubset<T, PasswordResetTokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PasswordResetTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetTokenUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PasswordResetTokens
     * const passwordResetToken = await prisma.passwordResetToken.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PasswordResetTokenUpdateManyArgs>(args: SelectSubset<T, PasswordResetTokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PasswordResetTokens and returns the data updated in the database.
     * @param {PasswordResetTokenUpdateManyAndReturnArgs} args - Arguments to update many PasswordResetTokens.
     * @example
     * // Update many PasswordResetTokens
     * const passwordResetToken = await prisma.passwordResetToken.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PasswordResetTokens and only return the `id`
     * const passwordResetTokenWithIdOnly = await prisma.passwordResetToken.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PasswordResetTokenUpdateManyAndReturnArgs>(args: SelectSubset<T, PasswordResetTokenUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PasswordResetToken.
     * @param {PasswordResetTokenUpsertArgs} args - Arguments to update or create a PasswordResetToken.
     * @example
     * // Update or create a PasswordResetToken
     * const passwordResetToken = await prisma.passwordResetToken.upsert({
     *   create: {
     *     // ... data to create a PasswordResetToken
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PasswordResetToken we want to update
     *   }
     * })
     */
    upsert<T extends PasswordResetTokenUpsertArgs>(args: SelectSubset<T, PasswordResetTokenUpsertArgs<ExtArgs>>): Prisma__PasswordResetTokenClient<$Result.GetResult<Prisma.$PasswordResetTokenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PasswordResetTokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetTokenCountArgs} args - Arguments to filter PasswordResetTokens to count.
     * @example
     * // Count the number of PasswordResetTokens
     * const count = await prisma.passwordResetToken.count({
     *   where: {
     *     // ... the filter for the PasswordResetTokens we want to count
     *   }
     * })
    **/
    count<T extends PasswordResetTokenCountArgs>(
      args?: Subset<T, PasswordResetTokenCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PasswordResetTokenCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PasswordResetToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetTokenAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PasswordResetTokenAggregateArgs>(args: Subset<T, PasswordResetTokenAggregateArgs>): Prisma.PrismaPromise<GetPasswordResetTokenAggregateType<T>>

    /**
     * Group by PasswordResetToken.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PasswordResetTokenGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PasswordResetTokenGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PasswordResetTokenGroupByArgs['orderBy'] }
        : { orderBy?: PasswordResetTokenGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PasswordResetTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPasswordResetTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PasswordResetToken model
   */
  readonly fields: PasswordResetTokenFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PasswordResetToken.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PasswordResetTokenClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PasswordResetToken model
   */
  interface PasswordResetTokenFieldRefs {
    readonly id: FieldRef<"PasswordResetToken", 'String'>
    readonly userId: FieldRef<"PasswordResetToken", 'String'>
    readonly token: FieldRef<"PasswordResetToken", 'String'>
    readonly expiresAt: FieldRef<"PasswordResetToken", 'DateTime'>
    readonly used: FieldRef<"PasswordResetToken", 'Boolean'>
    readonly createdAt: FieldRef<"PasswordResetToken", 'DateTime'>
    readonly usedAt: FieldRef<"PasswordResetToken", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PasswordResetToken findUnique
   */
  export type PasswordResetTokenFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null
    /**
     * Filter, which PasswordResetToken to fetch.
     */
    where: PasswordResetTokenWhereUniqueInput
  }

  /**
   * PasswordResetToken findUniqueOrThrow
   */
  export type PasswordResetTokenFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null
    /**
     * Filter, which PasswordResetToken to fetch.
     */
    where: PasswordResetTokenWhereUniqueInput
  }

  /**
   * PasswordResetToken findFirst
   */
  export type PasswordResetTokenFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null
    /**
     * Filter, which PasswordResetToken to fetch.
     */
    where?: PasswordResetTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResetTokens to fetch.
     */
    orderBy?: PasswordResetTokenOrderByWithRelationInput | PasswordResetTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PasswordResetTokens.
     */
    cursor?: PasswordResetTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResetTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResetTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PasswordResetTokens.
     */
    distinct?: PasswordResetTokenScalarFieldEnum | PasswordResetTokenScalarFieldEnum[]
  }

  /**
   * PasswordResetToken findFirstOrThrow
   */
  export type PasswordResetTokenFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null
    /**
     * Filter, which PasswordResetToken to fetch.
     */
    where?: PasswordResetTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResetTokens to fetch.
     */
    orderBy?: PasswordResetTokenOrderByWithRelationInput | PasswordResetTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PasswordResetTokens.
     */
    cursor?: PasswordResetTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResetTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResetTokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PasswordResetTokens.
     */
    distinct?: PasswordResetTokenScalarFieldEnum | PasswordResetTokenScalarFieldEnum[]
  }

  /**
   * PasswordResetToken findMany
   */
  export type PasswordResetTokenFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null
    /**
     * Filter, which PasswordResetTokens to fetch.
     */
    where?: PasswordResetTokenWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PasswordResetTokens to fetch.
     */
    orderBy?: PasswordResetTokenOrderByWithRelationInput | PasswordResetTokenOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PasswordResetTokens.
     */
    cursor?: PasswordResetTokenWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PasswordResetTokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PasswordResetTokens.
     */
    skip?: number
    distinct?: PasswordResetTokenScalarFieldEnum | PasswordResetTokenScalarFieldEnum[]
  }

  /**
   * PasswordResetToken create
   */
  export type PasswordResetTokenCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null
    /**
     * The data needed to create a PasswordResetToken.
     */
    data: XOR<PasswordResetTokenCreateInput, PasswordResetTokenUncheckedCreateInput>
  }

  /**
   * PasswordResetToken createMany
   */
  export type PasswordResetTokenCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PasswordResetTokens.
     */
    data: PasswordResetTokenCreateManyInput | PasswordResetTokenCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PasswordResetToken createManyAndReturn
   */
  export type PasswordResetTokenCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null
    /**
     * The data used to create many PasswordResetTokens.
     */
    data: PasswordResetTokenCreateManyInput | PasswordResetTokenCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PasswordResetToken update
   */
  export type PasswordResetTokenUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null
    /**
     * The data needed to update a PasswordResetToken.
     */
    data: XOR<PasswordResetTokenUpdateInput, PasswordResetTokenUncheckedUpdateInput>
    /**
     * Choose, which PasswordResetToken to update.
     */
    where: PasswordResetTokenWhereUniqueInput
  }

  /**
   * PasswordResetToken updateMany
   */
  export type PasswordResetTokenUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PasswordResetTokens.
     */
    data: XOR<PasswordResetTokenUpdateManyMutationInput, PasswordResetTokenUncheckedUpdateManyInput>
    /**
     * Filter which PasswordResetTokens to update
     */
    where?: PasswordResetTokenWhereInput
    /**
     * Limit how many PasswordResetTokens to update.
     */
    limit?: number
  }

  /**
   * PasswordResetToken updateManyAndReturn
   */
  export type PasswordResetTokenUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null
    /**
     * The data used to update PasswordResetTokens.
     */
    data: XOR<PasswordResetTokenUpdateManyMutationInput, PasswordResetTokenUncheckedUpdateManyInput>
    /**
     * Filter which PasswordResetTokens to update
     */
    where?: PasswordResetTokenWhereInput
    /**
     * Limit how many PasswordResetTokens to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PasswordResetToken upsert
   */
  export type PasswordResetTokenUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null
    /**
     * The filter to search for the PasswordResetToken to update in case it exists.
     */
    where: PasswordResetTokenWhereUniqueInput
    /**
     * In case the PasswordResetToken found by the `where` argument doesn't exist, create a new PasswordResetToken with this data.
     */
    create: XOR<PasswordResetTokenCreateInput, PasswordResetTokenUncheckedCreateInput>
    /**
     * In case the PasswordResetToken was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PasswordResetTokenUpdateInput, PasswordResetTokenUncheckedUpdateInput>
  }

  /**
   * PasswordResetToken delete
   */
  export type PasswordResetTokenDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null
    /**
     * Filter which PasswordResetToken to delete.
     */
    where: PasswordResetTokenWhereUniqueInput
  }

  /**
   * PasswordResetToken deleteMany
   */
  export type PasswordResetTokenDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PasswordResetTokens to delete
     */
    where?: PasswordResetTokenWhereInput
    /**
     * Limit how many PasswordResetTokens to delete.
     */
    limit?: number
  }

  /**
   * PasswordResetToken without action
   */
  export type PasswordResetTokenDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PasswordResetToken
     */
    select?: PasswordResetTokenSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PasswordResetToken
     */
    omit?: PasswordResetTokenOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PasswordResetTokenInclude<ExtArgs> | null
  }


  /**
   * Model UserSession
   */

  export type AggregateUserSession = {
    _count: UserSessionCountAggregateOutputType | null
    _min: UserSessionMinAggregateOutputType | null
    _max: UserSessionMaxAggregateOutputType | null
  }

  export type UserSessionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    sessionToken: string | null
    ipAddress: string | null
    userAgent: string | null
    status: $Enums.SessionStatus | null
    createdAt: Date | null
    expiresAt: Date | null
    lastActivity: Date | null
  }

  export type UserSessionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    sessionToken: string | null
    ipAddress: string | null
    userAgent: string | null
    status: $Enums.SessionStatus | null
    createdAt: Date | null
    expiresAt: Date | null
    lastActivity: Date | null
  }

  export type UserSessionCountAggregateOutputType = {
    id: number
    userId: number
    sessionToken: number
    deviceInfo: number
    ipAddress: number
    userAgent: number
    status: number
    createdAt: number
    expiresAt: number
    lastActivity: number
    _all: number
  }


  export type UserSessionMinAggregateInputType = {
    id?: true
    userId?: true
    sessionToken?: true
    ipAddress?: true
    userAgent?: true
    status?: true
    createdAt?: true
    expiresAt?: true
    lastActivity?: true
  }

  export type UserSessionMaxAggregateInputType = {
    id?: true
    userId?: true
    sessionToken?: true
    ipAddress?: true
    userAgent?: true
    status?: true
    createdAt?: true
    expiresAt?: true
    lastActivity?: true
  }

  export type UserSessionCountAggregateInputType = {
    id?: true
    userId?: true
    sessionToken?: true
    deviceInfo?: true
    ipAddress?: true
    userAgent?: true
    status?: true
    createdAt?: true
    expiresAt?: true
    lastActivity?: true
    _all?: true
  }

  export type UserSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserSession to aggregate.
     */
    where?: UserSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSessions to fetch.
     */
    orderBy?: UserSessionOrderByWithRelationInput | UserSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserSessions
    **/
    _count?: true | UserSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserSessionMaxAggregateInputType
  }

  export type GetUserSessionAggregateType<T extends UserSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateUserSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserSession[P]>
      : GetScalarType<T[P], AggregateUserSession[P]>
  }




  export type UserSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserSessionWhereInput
    orderBy?: UserSessionOrderByWithAggregationInput | UserSessionOrderByWithAggregationInput[]
    by: UserSessionScalarFieldEnum[] | UserSessionScalarFieldEnum
    having?: UserSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserSessionCountAggregateInputType | true
    _min?: UserSessionMinAggregateInputType
    _max?: UserSessionMaxAggregateInputType
  }

  export type UserSessionGroupByOutputType = {
    id: string
    userId: string
    sessionToken: string
    deviceInfo: JsonValue | null
    ipAddress: string | null
    userAgent: string | null
    status: $Enums.SessionStatus
    createdAt: Date
    expiresAt: Date
    lastActivity: Date
    _count: UserSessionCountAggregateOutputType | null
    _min: UserSessionMinAggregateOutputType | null
    _max: UserSessionMaxAggregateOutputType | null
  }

  type GetUserSessionGroupByPayload<T extends UserSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserSessionGroupByOutputType[P]>
            : GetScalarType<T[P], UserSessionGroupByOutputType[P]>
        }
      >
    >


  export type UserSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    sessionToken?: boolean
    deviceInfo?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    status?: boolean
    createdAt?: boolean
    expiresAt?: boolean
    lastActivity?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userSession"]>

  export type UserSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    sessionToken?: boolean
    deviceInfo?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    status?: boolean
    createdAt?: boolean
    expiresAt?: boolean
    lastActivity?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userSession"]>

  export type UserSessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    sessionToken?: boolean
    deviceInfo?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    status?: boolean
    createdAt?: boolean
    expiresAt?: boolean
    lastActivity?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userSession"]>

  export type UserSessionSelectScalar = {
    id?: boolean
    userId?: boolean
    sessionToken?: boolean
    deviceInfo?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    status?: boolean
    createdAt?: boolean
    expiresAt?: boolean
    lastActivity?: boolean
  }

  export type UserSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "sessionToken" | "deviceInfo" | "ipAddress" | "userAgent" | "status" | "createdAt" | "expiresAt" | "lastActivity", ExtArgs["result"]["userSession"]>
  export type UserSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UserSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UserSessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $UserSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserSession"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      sessionToken: string
      deviceInfo: Prisma.JsonValue | null
      ipAddress: string | null
      userAgent: string | null
      status: $Enums.SessionStatus
      createdAt: Date
      expiresAt: Date
      lastActivity: Date
    }, ExtArgs["result"]["userSession"]>
    composites: {}
  }

  type UserSessionGetPayload<S extends boolean | null | undefined | UserSessionDefaultArgs> = $Result.GetResult<Prisma.$UserSessionPayload, S>

  type UserSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserSessionCountAggregateInputType | true
    }

  export interface UserSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserSession'], meta: { name: 'UserSession' } }
    /**
     * Find zero or one UserSession that matches the filter.
     * @param {UserSessionFindUniqueArgs} args - Arguments to find a UserSession
     * @example
     * // Get one UserSession
     * const userSession = await prisma.userSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserSessionFindUniqueArgs>(args: SelectSubset<T, UserSessionFindUniqueArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserSessionFindUniqueOrThrowArgs} args - Arguments to find a UserSession
     * @example
     * // Get one UserSession
     * const userSession = await prisma.userSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, UserSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSessionFindFirstArgs} args - Arguments to find a UserSession
     * @example
     * // Get one UserSession
     * const userSession = await prisma.userSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserSessionFindFirstArgs>(args?: SelectSubset<T, UserSessionFindFirstArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSessionFindFirstOrThrowArgs} args - Arguments to find a UserSession
     * @example
     * // Get one UserSession
     * const userSession = await prisma.userSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, UserSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserSessions
     * const userSessions = await prisma.userSession.findMany()
     * 
     * // Get first 10 UserSessions
     * const userSessions = await prisma.userSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userSessionWithIdOnly = await prisma.userSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserSessionFindManyArgs>(args?: SelectSubset<T, UserSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserSession.
     * @param {UserSessionCreateArgs} args - Arguments to create a UserSession.
     * @example
     * // Create one UserSession
     * const UserSession = await prisma.userSession.create({
     *   data: {
     *     // ... data to create a UserSession
     *   }
     * })
     * 
     */
    create<T extends UserSessionCreateArgs>(args: SelectSubset<T, UserSessionCreateArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserSessions.
     * @param {UserSessionCreateManyArgs} args - Arguments to create many UserSessions.
     * @example
     * // Create many UserSessions
     * const userSession = await prisma.userSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserSessionCreateManyArgs>(args?: SelectSubset<T, UserSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserSessions and returns the data saved in the database.
     * @param {UserSessionCreateManyAndReturnArgs} args - Arguments to create many UserSessions.
     * @example
     * // Create many UserSessions
     * const userSession = await prisma.userSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserSessions and only return the `id`
     * const userSessionWithIdOnly = await prisma.userSession.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, UserSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserSession.
     * @param {UserSessionDeleteArgs} args - Arguments to delete one UserSession.
     * @example
     * // Delete one UserSession
     * const UserSession = await prisma.userSession.delete({
     *   where: {
     *     // ... filter to delete one UserSession
     *   }
     * })
     * 
     */
    delete<T extends UserSessionDeleteArgs>(args: SelectSubset<T, UserSessionDeleteArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserSession.
     * @param {UserSessionUpdateArgs} args - Arguments to update one UserSession.
     * @example
     * // Update one UserSession
     * const userSession = await prisma.userSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserSessionUpdateArgs>(args: SelectSubset<T, UserSessionUpdateArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserSessions.
     * @param {UserSessionDeleteManyArgs} args - Arguments to filter UserSessions to delete.
     * @example
     * // Delete a few UserSessions
     * const { count } = await prisma.userSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserSessionDeleteManyArgs>(args?: SelectSubset<T, UserSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserSessions
     * const userSession = await prisma.userSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserSessionUpdateManyArgs>(args: SelectSubset<T, UserSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserSessions and returns the data updated in the database.
     * @param {UserSessionUpdateManyAndReturnArgs} args - Arguments to update many UserSessions.
     * @example
     * // Update many UserSessions
     * const userSession = await prisma.userSession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserSessions and only return the `id`
     * const userSessionWithIdOnly = await prisma.userSession.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserSessionUpdateManyAndReturnArgs>(args: SelectSubset<T, UserSessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserSession.
     * @param {UserSessionUpsertArgs} args - Arguments to update or create a UserSession.
     * @example
     * // Update or create a UserSession
     * const userSession = await prisma.userSession.upsert({
     *   create: {
     *     // ... data to create a UserSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserSession we want to update
     *   }
     * })
     */
    upsert<T extends UserSessionUpsertArgs>(args: SelectSubset<T, UserSessionUpsertArgs<ExtArgs>>): Prisma__UserSessionClient<$Result.GetResult<Prisma.$UserSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSessionCountArgs} args - Arguments to filter UserSessions to count.
     * @example
     * // Count the number of UserSessions
     * const count = await prisma.userSession.count({
     *   where: {
     *     // ... the filter for the UserSessions we want to count
     *   }
     * })
    **/
    count<T extends UserSessionCountArgs>(
      args?: Subset<T, UserSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserSessionAggregateArgs>(args: Subset<T, UserSessionAggregateArgs>): Prisma.PrismaPromise<GetUserSessionAggregateType<T>>

    /**
     * Group by UserSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserSessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserSessionGroupByArgs['orderBy'] }
        : { orderBy?: UserSessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserSession model
   */
  readonly fields: UserSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserSession model
   */
  interface UserSessionFieldRefs {
    readonly id: FieldRef<"UserSession", 'String'>
    readonly userId: FieldRef<"UserSession", 'String'>
    readonly sessionToken: FieldRef<"UserSession", 'String'>
    readonly deviceInfo: FieldRef<"UserSession", 'Json'>
    readonly ipAddress: FieldRef<"UserSession", 'String'>
    readonly userAgent: FieldRef<"UserSession", 'String'>
    readonly status: FieldRef<"UserSession", 'SessionStatus'>
    readonly createdAt: FieldRef<"UserSession", 'DateTime'>
    readonly expiresAt: FieldRef<"UserSession", 'DateTime'>
    readonly lastActivity: FieldRef<"UserSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserSession findUnique
   */
  export type UserSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * Filter, which UserSession to fetch.
     */
    where: UserSessionWhereUniqueInput
  }

  /**
   * UserSession findUniqueOrThrow
   */
  export type UserSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * Filter, which UserSession to fetch.
     */
    where: UserSessionWhereUniqueInput
  }

  /**
   * UserSession findFirst
   */
  export type UserSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * Filter, which UserSession to fetch.
     */
    where?: UserSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSessions to fetch.
     */
    orderBy?: UserSessionOrderByWithRelationInput | UserSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserSessions.
     */
    cursor?: UserSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserSessions.
     */
    distinct?: UserSessionScalarFieldEnum | UserSessionScalarFieldEnum[]
  }

  /**
   * UserSession findFirstOrThrow
   */
  export type UserSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * Filter, which UserSession to fetch.
     */
    where?: UserSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSessions to fetch.
     */
    orderBy?: UserSessionOrderByWithRelationInput | UserSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserSessions.
     */
    cursor?: UserSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserSessions.
     */
    distinct?: UserSessionScalarFieldEnum | UserSessionScalarFieldEnum[]
  }

  /**
   * UserSession findMany
   */
  export type UserSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * Filter, which UserSessions to fetch.
     */
    where?: UserSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserSessions to fetch.
     */
    orderBy?: UserSessionOrderByWithRelationInput | UserSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserSessions.
     */
    cursor?: UserSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserSessions.
     */
    skip?: number
    distinct?: UserSessionScalarFieldEnum | UserSessionScalarFieldEnum[]
  }

  /**
   * UserSession create
   */
  export type UserSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a UserSession.
     */
    data: XOR<UserSessionCreateInput, UserSessionUncheckedCreateInput>
  }

  /**
   * UserSession createMany
   */
  export type UserSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserSessions.
     */
    data: UserSessionCreateManyInput | UserSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserSession createManyAndReturn
   */
  export type UserSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * The data used to create many UserSessions.
     */
    data: UserSessionCreateManyInput | UserSessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserSession update
   */
  export type UserSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a UserSession.
     */
    data: XOR<UserSessionUpdateInput, UserSessionUncheckedUpdateInput>
    /**
     * Choose, which UserSession to update.
     */
    where: UserSessionWhereUniqueInput
  }

  /**
   * UserSession updateMany
   */
  export type UserSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserSessions.
     */
    data: XOR<UserSessionUpdateManyMutationInput, UserSessionUncheckedUpdateManyInput>
    /**
     * Filter which UserSessions to update
     */
    where?: UserSessionWhereInput
    /**
     * Limit how many UserSessions to update.
     */
    limit?: number
  }

  /**
   * UserSession updateManyAndReturn
   */
  export type UserSessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * The data used to update UserSessions.
     */
    data: XOR<UserSessionUpdateManyMutationInput, UserSessionUncheckedUpdateManyInput>
    /**
     * Filter which UserSessions to update
     */
    where?: UserSessionWhereInput
    /**
     * Limit how many UserSessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserSession upsert
   */
  export type UserSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the UserSession to update in case it exists.
     */
    where: UserSessionWhereUniqueInput
    /**
     * In case the UserSession found by the `where` argument doesn't exist, create a new UserSession with this data.
     */
    create: XOR<UserSessionCreateInput, UserSessionUncheckedCreateInput>
    /**
     * In case the UserSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserSessionUpdateInput, UserSessionUncheckedUpdateInput>
  }

  /**
   * UserSession delete
   */
  export type UserSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
    /**
     * Filter which UserSession to delete.
     */
    where: UserSessionWhereUniqueInput
  }

  /**
   * UserSession deleteMany
   */
  export type UserSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserSessions to delete
     */
    where?: UserSessionWhereInput
    /**
     * Limit how many UserSessions to delete.
     */
    limit?: number
  }

  /**
   * UserSession without action
   */
  export type UserSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserSession
     */
    select?: UserSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserSession
     */
    omit?: UserSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserSessionInclude<ExtArgs> | null
  }


  /**
   * Model Friendship
   */

  export type AggregateFriendship = {
    _count: FriendshipCountAggregateOutputType | null
    _min: FriendshipMinAggregateOutputType | null
    _max: FriendshipMaxAggregateOutputType | null
  }

  export type FriendshipMinAggregateOutputType = {
    id: string | null
    requesterId: string | null
    receiverId: string | null
    status: $Enums.FriendshipStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FriendshipMaxAggregateOutputType = {
    id: string | null
    requesterId: string | null
    receiverId: string | null
    status: $Enums.FriendshipStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FriendshipCountAggregateOutputType = {
    id: number
    requesterId: number
    receiverId: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type FriendshipMinAggregateInputType = {
    id?: true
    requesterId?: true
    receiverId?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FriendshipMaxAggregateInputType = {
    id?: true
    requesterId?: true
    receiverId?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FriendshipCountAggregateInputType = {
    id?: true
    requesterId?: true
    receiverId?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type FriendshipAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Friendship to aggregate.
     */
    where?: FriendshipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Friendships to fetch.
     */
    orderBy?: FriendshipOrderByWithRelationInput | FriendshipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FriendshipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Friendships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Friendships.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Friendships
    **/
    _count?: true | FriendshipCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FriendshipMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FriendshipMaxAggregateInputType
  }

  export type GetFriendshipAggregateType<T extends FriendshipAggregateArgs> = {
        [P in keyof T & keyof AggregateFriendship]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFriendship[P]>
      : GetScalarType<T[P], AggregateFriendship[P]>
  }




  export type FriendshipGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FriendshipWhereInput
    orderBy?: FriendshipOrderByWithAggregationInput | FriendshipOrderByWithAggregationInput[]
    by: FriendshipScalarFieldEnum[] | FriendshipScalarFieldEnum
    having?: FriendshipScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FriendshipCountAggregateInputType | true
    _min?: FriendshipMinAggregateInputType
    _max?: FriendshipMaxAggregateInputType
  }

  export type FriendshipGroupByOutputType = {
    id: string
    requesterId: string
    receiverId: string
    status: $Enums.FriendshipStatus
    createdAt: Date
    updatedAt: Date
    _count: FriendshipCountAggregateOutputType | null
    _min: FriendshipMinAggregateOutputType | null
    _max: FriendshipMaxAggregateOutputType | null
  }

  type GetFriendshipGroupByPayload<T extends FriendshipGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FriendshipGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FriendshipGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FriendshipGroupByOutputType[P]>
            : GetScalarType<T[P], FriendshipGroupByOutputType[P]>
        }
      >
    >


  export type FriendshipSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requesterId?: boolean
    receiverId?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    requester?: boolean | UserDefaultArgs<ExtArgs>
    receiver?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["friendship"]>

  export type FriendshipSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requesterId?: boolean
    receiverId?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    requester?: boolean | UserDefaultArgs<ExtArgs>
    receiver?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["friendship"]>

  export type FriendshipSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requesterId?: boolean
    receiverId?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    requester?: boolean | UserDefaultArgs<ExtArgs>
    receiver?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["friendship"]>

  export type FriendshipSelectScalar = {
    id?: boolean
    requesterId?: boolean
    receiverId?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type FriendshipOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "requesterId" | "receiverId" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["friendship"]>
  export type FriendshipInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    requester?: boolean | UserDefaultArgs<ExtArgs>
    receiver?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type FriendshipIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    requester?: boolean | UserDefaultArgs<ExtArgs>
    receiver?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type FriendshipIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    requester?: boolean | UserDefaultArgs<ExtArgs>
    receiver?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $FriendshipPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Friendship"
    objects: {
      requester: Prisma.$UserPayload<ExtArgs>
      receiver: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      requesterId: string
      receiverId: string
      status: $Enums.FriendshipStatus
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["friendship"]>
    composites: {}
  }

  type FriendshipGetPayload<S extends boolean | null | undefined | FriendshipDefaultArgs> = $Result.GetResult<Prisma.$FriendshipPayload, S>

  type FriendshipCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FriendshipFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FriendshipCountAggregateInputType | true
    }

  export interface FriendshipDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Friendship'], meta: { name: 'Friendship' } }
    /**
     * Find zero or one Friendship that matches the filter.
     * @param {FriendshipFindUniqueArgs} args - Arguments to find a Friendship
     * @example
     * // Get one Friendship
     * const friendship = await prisma.friendship.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FriendshipFindUniqueArgs>(args: SelectSubset<T, FriendshipFindUniqueArgs<ExtArgs>>): Prisma__FriendshipClient<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Friendship that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FriendshipFindUniqueOrThrowArgs} args - Arguments to find a Friendship
     * @example
     * // Get one Friendship
     * const friendship = await prisma.friendship.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FriendshipFindUniqueOrThrowArgs>(args: SelectSubset<T, FriendshipFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FriendshipClient<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Friendship that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FriendshipFindFirstArgs} args - Arguments to find a Friendship
     * @example
     * // Get one Friendship
     * const friendship = await prisma.friendship.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FriendshipFindFirstArgs>(args?: SelectSubset<T, FriendshipFindFirstArgs<ExtArgs>>): Prisma__FriendshipClient<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Friendship that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FriendshipFindFirstOrThrowArgs} args - Arguments to find a Friendship
     * @example
     * // Get one Friendship
     * const friendship = await prisma.friendship.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FriendshipFindFirstOrThrowArgs>(args?: SelectSubset<T, FriendshipFindFirstOrThrowArgs<ExtArgs>>): Prisma__FriendshipClient<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Friendships that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FriendshipFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Friendships
     * const friendships = await prisma.friendship.findMany()
     * 
     * // Get first 10 Friendships
     * const friendships = await prisma.friendship.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const friendshipWithIdOnly = await prisma.friendship.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FriendshipFindManyArgs>(args?: SelectSubset<T, FriendshipFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Friendship.
     * @param {FriendshipCreateArgs} args - Arguments to create a Friendship.
     * @example
     * // Create one Friendship
     * const Friendship = await prisma.friendship.create({
     *   data: {
     *     // ... data to create a Friendship
     *   }
     * })
     * 
     */
    create<T extends FriendshipCreateArgs>(args: SelectSubset<T, FriendshipCreateArgs<ExtArgs>>): Prisma__FriendshipClient<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Friendships.
     * @param {FriendshipCreateManyArgs} args - Arguments to create many Friendships.
     * @example
     * // Create many Friendships
     * const friendship = await prisma.friendship.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FriendshipCreateManyArgs>(args?: SelectSubset<T, FriendshipCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Friendships and returns the data saved in the database.
     * @param {FriendshipCreateManyAndReturnArgs} args - Arguments to create many Friendships.
     * @example
     * // Create many Friendships
     * const friendship = await prisma.friendship.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Friendships and only return the `id`
     * const friendshipWithIdOnly = await prisma.friendship.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FriendshipCreateManyAndReturnArgs>(args?: SelectSubset<T, FriendshipCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Friendship.
     * @param {FriendshipDeleteArgs} args - Arguments to delete one Friendship.
     * @example
     * // Delete one Friendship
     * const Friendship = await prisma.friendship.delete({
     *   where: {
     *     // ... filter to delete one Friendship
     *   }
     * })
     * 
     */
    delete<T extends FriendshipDeleteArgs>(args: SelectSubset<T, FriendshipDeleteArgs<ExtArgs>>): Prisma__FriendshipClient<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Friendship.
     * @param {FriendshipUpdateArgs} args - Arguments to update one Friendship.
     * @example
     * // Update one Friendship
     * const friendship = await prisma.friendship.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FriendshipUpdateArgs>(args: SelectSubset<T, FriendshipUpdateArgs<ExtArgs>>): Prisma__FriendshipClient<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Friendships.
     * @param {FriendshipDeleteManyArgs} args - Arguments to filter Friendships to delete.
     * @example
     * // Delete a few Friendships
     * const { count } = await prisma.friendship.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FriendshipDeleteManyArgs>(args?: SelectSubset<T, FriendshipDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Friendships.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FriendshipUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Friendships
     * const friendship = await prisma.friendship.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FriendshipUpdateManyArgs>(args: SelectSubset<T, FriendshipUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Friendships and returns the data updated in the database.
     * @param {FriendshipUpdateManyAndReturnArgs} args - Arguments to update many Friendships.
     * @example
     * // Update many Friendships
     * const friendship = await prisma.friendship.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Friendships and only return the `id`
     * const friendshipWithIdOnly = await prisma.friendship.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FriendshipUpdateManyAndReturnArgs>(args: SelectSubset<T, FriendshipUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Friendship.
     * @param {FriendshipUpsertArgs} args - Arguments to update or create a Friendship.
     * @example
     * // Update or create a Friendship
     * const friendship = await prisma.friendship.upsert({
     *   create: {
     *     // ... data to create a Friendship
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Friendship we want to update
     *   }
     * })
     */
    upsert<T extends FriendshipUpsertArgs>(args: SelectSubset<T, FriendshipUpsertArgs<ExtArgs>>): Prisma__FriendshipClient<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Friendships.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FriendshipCountArgs} args - Arguments to filter Friendships to count.
     * @example
     * // Count the number of Friendships
     * const count = await prisma.friendship.count({
     *   where: {
     *     // ... the filter for the Friendships we want to count
     *   }
     * })
    **/
    count<T extends FriendshipCountArgs>(
      args?: Subset<T, FriendshipCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FriendshipCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Friendship.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FriendshipAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FriendshipAggregateArgs>(args: Subset<T, FriendshipAggregateArgs>): Prisma.PrismaPromise<GetFriendshipAggregateType<T>>

    /**
     * Group by Friendship.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FriendshipGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FriendshipGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FriendshipGroupByArgs['orderBy'] }
        : { orderBy?: FriendshipGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FriendshipGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFriendshipGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Friendship model
   */
  readonly fields: FriendshipFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Friendship.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FriendshipClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    requester<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    receiver<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Friendship model
   */
  interface FriendshipFieldRefs {
    readonly id: FieldRef<"Friendship", 'String'>
    readonly requesterId: FieldRef<"Friendship", 'String'>
    readonly receiverId: FieldRef<"Friendship", 'String'>
    readonly status: FieldRef<"Friendship", 'FriendshipStatus'>
    readonly createdAt: FieldRef<"Friendship", 'DateTime'>
    readonly updatedAt: FieldRef<"Friendship", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Friendship findUnique
   */
  export type FriendshipFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipInclude<ExtArgs> | null
    /**
     * Filter, which Friendship to fetch.
     */
    where: FriendshipWhereUniqueInput
  }

  /**
   * Friendship findUniqueOrThrow
   */
  export type FriendshipFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipInclude<ExtArgs> | null
    /**
     * Filter, which Friendship to fetch.
     */
    where: FriendshipWhereUniqueInput
  }

  /**
   * Friendship findFirst
   */
  export type FriendshipFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipInclude<ExtArgs> | null
    /**
     * Filter, which Friendship to fetch.
     */
    where?: FriendshipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Friendships to fetch.
     */
    orderBy?: FriendshipOrderByWithRelationInput | FriendshipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Friendships.
     */
    cursor?: FriendshipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Friendships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Friendships.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Friendships.
     */
    distinct?: FriendshipScalarFieldEnum | FriendshipScalarFieldEnum[]
  }

  /**
   * Friendship findFirstOrThrow
   */
  export type FriendshipFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipInclude<ExtArgs> | null
    /**
     * Filter, which Friendship to fetch.
     */
    where?: FriendshipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Friendships to fetch.
     */
    orderBy?: FriendshipOrderByWithRelationInput | FriendshipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Friendships.
     */
    cursor?: FriendshipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Friendships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Friendships.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Friendships.
     */
    distinct?: FriendshipScalarFieldEnum | FriendshipScalarFieldEnum[]
  }

  /**
   * Friendship findMany
   */
  export type FriendshipFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipInclude<ExtArgs> | null
    /**
     * Filter, which Friendships to fetch.
     */
    where?: FriendshipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Friendships to fetch.
     */
    orderBy?: FriendshipOrderByWithRelationInput | FriendshipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Friendships.
     */
    cursor?: FriendshipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Friendships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Friendships.
     */
    skip?: number
    distinct?: FriendshipScalarFieldEnum | FriendshipScalarFieldEnum[]
  }

  /**
   * Friendship create
   */
  export type FriendshipCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipInclude<ExtArgs> | null
    /**
     * The data needed to create a Friendship.
     */
    data: XOR<FriendshipCreateInput, FriendshipUncheckedCreateInput>
  }

  /**
   * Friendship createMany
   */
  export type FriendshipCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Friendships.
     */
    data: FriendshipCreateManyInput | FriendshipCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Friendship createManyAndReturn
   */
  export type FriendshipCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * The data used to create many Friendships.
     */
    data: FriendshipCreateManyInput | FriendshipCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Friendship update
   */
  export type FriendshipUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipInclude<ExtArgs> | null
    /**
     * The data needed to update a Friendship.
     */
    data: XOR<FriendshipUpdateInput, FriendshipUncheckedUpdateInput>
    /**
     * Choose, which Friendship to update.
     */
    where: FriendshipWhereUniqueInput
  }

  /**
   * Friendship updateMany
   */
  export type FriendshipUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Friendships.
     */
    data: XOR<FriendshipUpdateManyMutationInput, FriendshipUncheckedUpdateManyInput>
    /**
     * Filter which Friendships to update
     */
    where?: FriendshipWhereInput
    /**
     * Limit how many Friendships to update.
     */
    limit?: number
  }

  /**
   * Friendship updateManyAndReturn
   */
  export type FriendshipUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * The data used to update Friendships.
     */
    data: XOR<FriendshipUpdateManyMutationInput, FriendshipUncheckedUpdateManyInput>
    /**
     * Filter which Friendships to update
     */
    where?: FriendshipWhereInput
    /**
     * Limit how many Friendships to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Friendship upsert
   */
  export type FriendshipUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipInclude<ExtArgs> | null
    /**
     * The filter to search for the Friendship to update in case it exists.
     */
    where: FriendshipWhereUniqueInput
    /**
     * In case the Friendship found by the `where` argument doesn't exist, create a new Friendship with this data.
     */
    create: XOR<FriendshipCreateInput, FriendshipUncheckedCreateInput>
    /**
     * In case the Friendship was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FriendshipUpdateInput, FriendshipUncheckedUpdateInput>
  }

  /**
   * Friendship delete
   */
  export type FriendshipDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipInclude<ExtArgs> | null
    /**
     * Filter which Friendship to delete.
     */
    where: FriendshipWhereUniqueInput
  }

  /**
   * Friendship deleteMany
   */
  export type FriendshipDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Friendships to delete
     */
    where?: FriendshipWhereInput
    /**
     * Limit how many Friendships to delete.
     */
    limit?: number
  }

  /**
   * Friendship without action
   */
  export type FriendshipDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipInclude<ExtArgs> | null
  }


  /**
   * Model GameSession
   */

  export type AggregateGameSession = {
    _count: GameSessionCountAggregateOutputType | null
    _avg: GameSessionAvgAggregateOutputType | null
    _sum: GameSessionSumAggregateOutputType | null
    _min: GameSessionMinAggregateOutputType | null
    _max: GameSessionMaxAggregateOutputType | null
  }

  export type GameSessionAvgAggregateOutputType = {
    maxPlayers: number | null
    currentRound: number | null
    totalRounds: number | null
    maxMistakes: number | null
    timeLimit: number | null
  }

  export type GameSessionSumAggregateOutputType = {
    maxPlayers: number | null
    currentRound: number | null
    totalRounds: number | null
    maxMistakes: number | null
    timeLimit: number | null
  }

  export type GameSessionMinAggregateOutputType = {
    id: string | null
    roomCode: string | null
    gameType: $Enums.GameType | null
    status: $Enums.GameStatus | null
    maxPlayers: number | null
    currentRound: number | null
    totalRounds: number | null
    maxMistakes: number | null
    difficulty: string | null
    timeLimit: number | null
    createdAt: Date | null
    startedAt: Date | null
    endedAt: Date | null
    updatedAt: Date | null
  }

  export type GameSessionMaxAggregateOutputType = {
    id: string | null
    roomCode: string | null
    gameType: $Enums.GameType | null
    status: $Enums.GameStatus | null
    maxPlayers: number | null
    currentRound: number | null
    totalRounds: number | null
    maxMistakes: number | null
    difficulty: string | null
    timeLimit: number | null
    createdAt: Date | null
    startedAt: Date | null
    endedAt: Date | null
    updatedAt: Date | null
  }

  export type GameSessionCountAggregateOutputType = {
    id: number
    roomCode: number
    gameType: number
    status: number
    maxPlayers: number
    currentRound: number
    totalRounds: number
    maxMistakes: number
    difficulty: number
    timeLimit: number
    createdAt: number
    startedAt: number
    endedAt: number
    updatedAt: number
    _all: number
  }


  export type GameSessionAvgAggregateInputType = {
    maxPlayers?: true
    currentRound?: true
    totalRounds?: true
    maxMistakes?: true
    timeLimit?: true
  }

  export type GameSessionSumAggregateInputType = {
    maxPlayers?: true
    currentRound?: true
    totalRounds?: true
    maxMistakes?: true
    timeLimit?: true
  }

  export type GameSessionMinAggregateInputType = {
    id?: true
    roomCode?: true
    gameType?: true
    status?: true
    maxPlayers?: true
    currentRound?: true
    totalRounds?: true
    maxMistakes?: true
    difficulty?: true
    timeLimit?: true
    createdAt?: true
    startedAt?: true
    endedAt?: true
    updatedAt?: true
  }

  export type GameSessionMaxAggregateInputType = {
    id?: true
    roomCode?: true
    gameType?: true
    status?: true
    maxPlayers?: true
    currentRound?: true
    totalRounds?: true
    maxMistakes?: true
    difficulty?: true
    timeLimit?: true
    createdAt?: true
    startedAt?: true
    endedAt?: true
    updatedAt?: true
  }

  export type GameSessionCountAggregateInputType = {
    id?: true
    roomCode?: true
    gameType?: true
    status?: true
    maxPlayers?: true
    currentRound?: true
    totalRounds?: true
    maxMistakes?: true
    difficulty?: true
    timeLimit?: true
    createdAt?: true
    startedAt?: true
    endedAt?: true
    updatedAt?: true
    _all?: true
  }

  export type GameSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GameSession to aggregate.
     */
    where?: GameSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameSessions to fetch.
     */
    orderBy?: GameSessionOrderByWithRelationInput | GameSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GameSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GameSessions
    **/
    _count?: true | GameSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GameSessionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GameSessionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GameSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GameSessionMaxAggregateInputType
  }

  export type GetGameSessionAggregateType<T extends GameSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateGameSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGameSession[P]>
      : GetScalarType<T[P], AggregateGameSession[P]>
  }




  export type GameSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameSessionWhereInput
    orderBy?: GameSessionOrderByWithAggregationInput | GameSessionOrderByWithAggregationInput[]
    by: GameSessionScalarFieldEnum[] | GameSessionScalarFieldEnum
    having?: GameSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GameSessionCountAggregateInputType | true
    _avg?: GameSessionAvgAggregateInputType
    _sum?: GameSessionSumAggregateInputType
    _min?: GameSessionMinAggregateInputType
    _max?: GameSessionMaxAggregateInputType
  }

  export type GameSessionGroupByOutputType = {
    id: string
    roomCode: string | null
    gameType: $Enums.GameType
    status: $Enums.GameStatus
    maxPlayers: number
    currentRound: number
    totalRounds: number
    maxMistakes: number
    difficulty: string
    timeLimit: number | null
    createdAt: Date
    startedAt: Date | null
    endedAt: Date | null
    updatedAt: Date
    _count: GameSessionCountAggregateOutputType | null
    _avg: GameSessionAvgAggregateOutputType | null
    _sum: GameSessionSumAggregateOutputType | null
    _min: GameSessionMinAggregateOutputType | null
    _max: GameSessionMaxAggregateOutputType | null
  }

  type GetGameSessionGroupByPayload<T extends GameSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GameSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GameSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GameSessionGroupByOutputType[P]>
            : GetScalarType<T[P], GameSessionGroupByOutputType[P]>
        }
      >
    >


  export type GameSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roomCode?: boolean
    gameType?: boolean
    status?: boolean
    maxPlayers?: boolean
    currentRound?: boolean
    totalRounds?: boolean
    maxMistakes?: boolean
    difficulty?: boolean
    timeLimit?: boolean
    createdAt?: boolean
    startedAt?: boolean
    endedAt?: boolean
    updatedAt?: boolean
    participants?: boolean | GameSession$participantsArgs<ExtArgs>
    rounds?: boolean | GameSession$roundsArgs<ExtArgs>
    _count?: boolean | GameSessionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gameSession"]>

  export type GameSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roomCode?: boolean
    gameType?: boolean
    status?: boolean
    maxPlayers?: boolean
    currentRound?: boolean
    totalRounds?: boolean
    maxMistakes?: boolean
    difficulty?: boolean
    timeLimit?: boolean
    createdAt?: boolean
    startedAt?: boolean
    endedAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["gameSession"]>

  export type GameSessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roomCode?: boolean
    gameType?: boolean
    status?: boolean
    maxPlayers?: boolean
    currentRound?: boolean
    totalRounds?: boolean
    maxMistakes?: boolean
    difficulty?: boolean
    timeLimit?: boolean
    createdAt?: boolean
    startedAt?: boolean
    endedAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["gameSession"]>

  export type GameSessionSelectScalar = {
    id?: boolean
    roomCode?: boolean
    gameType?: boolean
    status?: boolean
    maxPlayers?: boolean
    currentRound?: boolean
    totalRounds?: boolean
    maxMistakes?: boolean
    difficulty?: boolean
    timeLimit?: boolean
    createdAt?: boolean
    startedAt?: boolean
    endedAt?: boolean
    updatedAt?: boolean
  }

  export type GameSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "roomCode" | "gameType" | "status" | "maxPlayers" | "currentRound" | "totalRounds" | "maxMistakes" | "difficulty" | "timeLimit" | "createdAt" | "startedAt" | "endedAt" | "updatedAt", ExtArgs["result"]["gameSession"]>
  export type GameSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    participants?: boolean | GameSession$participantsArgs<ExtArgs>
    rounds?: boolean | GameSession$roundsArgs<ExtArgs>
    _count?: boolean | GameSessionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type GameSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type GameSessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $GameSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GameSession"
    objects: {
      participants: Prisma.$GameParticipantPayload<ExtArgs>[]
      rounds: Prisma.$GameRoundPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      roomCode: string | null
      gameType: $Enums.GameType
      status: $Enums.GameStatus
      maxPlayers: number
      currentRound: number
      totalRounds: number
      maxMistakes: number
      difficulty: string
      timeLimit: number | null
      createdAt: Date
      startedAt: Date | null
      endedAt: Date | null
      updatedAt: Date
    }, ExtArgs["result"]["gameSession"]>
    composites: {}
  }

  type GameSessionGetPayload<S extends boolean | null | undefined | GameSessionDefaultArgs> = $Result.GetResult<Prisma.$GameSessionPayload, S>

  type GameSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GameSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GameSessionCountAggregateInputType | true
    }

  export interface GameSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GameSession'], meta: { name: 'GameSession' } }
    /**
     * Find zero or one GameSession that matches the filter.
     * @param {GameSessionFindUniqueArgs} args - Arguments to find a GameSession
     * @example
     * // Get one GameSession
     * const gameSession = await prisma.gameSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GameSessionFindUniqueArgs>(args: SelectSubset<T, GameSessionFindUniqueArgs<ExtArgs>>): Prisma__GameSessionClient<$Result.GetResult<Prisma.$GameSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GameSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GameSessionFindUniqueOrThrowArgs} args - Arguments to find a GameSession
     * @example
     * // Get one GameSession
     * const gameSession = await prisma.gameSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GameSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, GameSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GameSessionClient<$Result.GetResult<Prisma.$GameSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GameSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameSessionFindFirstArgs} args - Arguments to find a GameSession
     * @example
     * // Get one GameSession
     * const gameSession = await prisma.gameSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GameSessionFindFirstArgs>(args?: SelectSubset<T, GameSessionFindFirstArgs<ExtArgs>>): Prisma__GameSessionClient<$Result.GetResult<Prisma.$GameSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GameSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameSessionFindFirstOrThrowArgs} args - Arguments to find a GameSession
     * @example
     * // Get one GameSession
     * const gameSession = await prisma.gameSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GameSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, GameSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__GameSessionClient<$Result.GetResult<Prisma.$GameSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GameSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GameSessions
     * const gameSessions = await prisma.gameSession.findMany()
     * 
     * // Get first 10 GameSessions
     * const gameSessions = await prisma.gameSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const gameSessionWithIdOnly = await prisma.gameSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GameSessionFindManyArgs>(args?: SelectSubset<T, GameSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GameSession.
     * @param {GameSessionCreateArgs} args - Arguments to create a GameSession.
     * @example
     * // Create one GameSession
     * const GameSession = await prisma.gameSession.create({
     *   data: {
     *     // ... data to create a GameSession
     *   }
     * })
     * 
     */
    create<T extends GameSessionCreateArgs>(args: SelectSubset<T, GameSessionCreateArgs<ExtArgs>>): Prisma__GameSessionClient<$Result.GetResult<Prisma.$GameSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GameSessions.
     * @param {GameSessionCreateManyArgs} args - Arguments to create many GameSessions.
     * @example
     * // Create many GameSessions
     * const gameSession = await prisma.gameSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GameSessionCreateManyArgs>(args?: SelectSubset<T, GameSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GameSessions and returns the data saved in the database.
     * @param {GameSessionCreateManyAndReturnArgs} args - Arguments to create many GameSessions.
     * @example
     * // Create many GameSessions
     * const gameSession = await prisma.gameSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GameSessions and only return the `id`
     * const gameSessionWithIdOnly = await prisma.gameSession.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GameSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, GameSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameSessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a GameSession.
     * @param {GameSessionDeleteArgs} args - Arguments to delete one GameSession.
     * @example
     * // Delete one GameSession
     * const GameSession = await prisma.gameSession.delete({
     *   where: {
     *     // ... filter to delete one GameSession
     *   }
     * })
     * 
     */
    delete<T extends GameSessionDeleteArgs>(args: SelectSubset<T, GameSessionDeleteArgs<ExtArgs>>): Prisma__GameSessionClient<$Result.GetResult<Prisma.$GameSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GameSession.
     * @param {GameSessionUpdateArgs} args - Arguments to update one GameSession.
     * @example
     * // Update one GameSession
     * const gameSession = await prisma.gameSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GameSessionUpdateArgs>(args: SelectSubset<T, GameSessionUpdateArgs<ExtArgs>>): Prisma__GameSessionClient<$Result.GetResult<Prisma.$GameSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GameSessions.
     * @param {GameSessionDeleteManyArgs} args - Arguments to filter GameSessions to delete.
     * @example
     * // Delete a few GameSessions
     * const { count } = await prisma.gameSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GameSessionDeleteManyArgs>(args?: SelectSubset<T, GameSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GameSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GameSessions
     * const gameSession = await prisma.gameSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GameSessionUpdateManyArgs>(args: SelectSubset<T, GameSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GameSessions and returns the data updated in the database.
     * @param {GameSessionUpdateManyAndReturnArgs} args - Arguments to update many GameSessions.
     * @example
     * // Update many GameSessions
     * const gameSession = await prisma.gameSession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more GameSessions and only return the `id`
     * const gameSessionWithIdOnly = await prisma.gameSession.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GameSessionUpdateManyAndReturnArgs>(args: SelectSubset<T, GameSessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameSessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one GameSession.
     * @param {GameSessionUpsertArgs} args - Arguments to update or create a GameSession.
     * @example
     * // Update or create a GameSession
     * const gameSession = await prisma.gameSession.upsert({
     *   create: {
     *     // ... data to create a GameSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GameSession we want to update
     *   }
     * })
     */
    upsert<T extends GameSessionUpsertArgs>(args: SelectSubset<T, GameSessionUpsertArgs<ExtArgs>>): Prisma__GameSessionClient<$Result.GetResult<Prisma.$GameSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GameSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameSessionCountArgs} args - Arguments to filter GameSessions to count.
     * @example
     * // Count the number of GameSessions
     * const count = await prisma.gameSession.count({
     *   where: {
     *     // ... the filter for the GameSessions we want to count
     *   }
     * })
    **/
    count<T extends GameSessionCountArgs>(
      args?: Subset<T, GameSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GameSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GameSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GameSessionAggregateArgs>(args: Subset<T, GameSessionAggregateArgs>): Prisma.PrismaPromise<GetGameSessionAggregateType<T>>

    /**
     * Group by GameSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameSessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GameSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GameSessionGroupByArgs['orderBy'] }
        : { orderBy?: GameSessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GameSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGameSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GameSession model
   */
  readonly fields: GameSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GameSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GameSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    participants<T extends GameSession$participantsArgs<ExtArgs> = {}>(args?: Subset<T, GameSession$participantsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameParticipantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    rounds<T extends GameSession$roundsArgs<ExtArgs> = {}>(args?: Subset<T, GameSession$roundsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameRoundPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GameSession model
   */
  interface GameSessionFieldRefs {
    readonly id: FieldRef<"GameSession", 'String'>
    readonly roomCode: FieldRef<"GameSession", 'String'>
    readonly gameType: FieldRef<"GameSession", 'GameType'>
    readonly status: FieldRef<"GameSession", 'GameStatus'>
    readonly maxPlayers: FieldRef<"GameSession", 'Int'>
    readonly currentRound: FieldRef<"GameSession", 'Int'>
    readonly totalRounds: FieldRef<"GameSession", 'Int'>
    readonly maxMistakes: FieldRef<"GameSession", 'Int'>
    readonly difficulty: FieldRef<"GameSession", 'String'>
    readonly timeLimit: FieldRef<"GameSession", 'Int'>
    readonly createdAt: FieldRef<"GameSession", 'DateTime'>
    readonly startedAt: FieldRef<"GameSession", 'DateTime'>
    readonly endedAt: FieldRef<"GameSession", 'DateTime'>
    readonly updatedAt: FieldRef<"GameSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GameSession findUnique
   */
  export type GameSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSession
     */
    select?: GameSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSession
     */
    omit?: GameSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameSessionInclude<ExtArgs> | null
    /**
     * Filter, which GameSession to fetch.
     */
    where: GameSessionWhereUniqueInput
  }

  /**
   * GameSession findUniqueOrThrow
   */
  export type GameSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSession
     */
    select?: GameSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSession
     */
    omit?: GameSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameSessionInclude<ExtArgs> | null
    /**
     * Filter, which GameSession to fetch.
     */
    where: GameSessionWhereUniqueInput
  }

  /**
   * GameSession findFirst
   */
  export type GameSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSession
     */
    select?: GameSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSession
     */
    omit?: GameSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameSessionInclude<ExtArgs> | null
    /**
     * Filter, which GameSession to fetch.
     */
    where?: GameSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameSessions to fetch.
     */
    orderBy?: GameSessionOrderByWithRelationInput | GameSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GameSessions.
     */
    cursor?: GameSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GameSessions.
     */
    distinct?: GameSessionScalarFieldEnum | GameSessionScalarFieldEnum[]
  }

  /**
   * GameSession findFirstOrThrow
   */
  export type GameSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSession
     */
    select?: GameSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSession
     */
    omit?: GameSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameSessionInclude<ExtArgs> | null
    /**
     * Filter, which GameSession to fetch.
     */
    where?: GameSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameSessions to fetch.
     */
    orderBy?: GameSessionOrderByWithRelationInput | GameSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GameSessions.
     */
    cursor?: GameSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GameSessions.
     */
    distinct?: GameSessionScalarFieldEnum | GameSessionScalarFieldEnum[]
  }

  /**
   * GameSession findMany
   */
  export type GameSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSession
     */
    select?: GameSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSession
     */
    omit?: GameSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameSessionInclude<ExtArgs> | null
    /**
     * Filter, which GameSessions to fetch.
     */
    where?: GameSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameSessions to fetch.
     */
    orderBy?: GameSessionOrderByWithRelationInput | GameSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GameSessions.
     */
    cursor?: GameSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameSessions.
     */
    skip?: number
    distinct?: GameSessionScalarFieldEnum | GameSessionScalarFieldEnum[]
  }

  /**
   * GameSession create
   */
  export type GameSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSession
     */
    select?: GameSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSession
     */
    omit?: GameSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a GameSession.
     */
    data: XOR<GameSessionCreateInput, GameSessionUncheckedCreateInput>
  }

  /**
   * GameSession createMany
   */
  export type GameSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GameSessions.
     */
    data: GameSessionCreateManyInput | GameSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GameSession createManyAndReturn
   */
  export type GameSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSession
     */
    select?: GameSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GameSession
     */
    omit?: GameSessionOmit<ExtArgs> | null
    /**
     * The data used to create many GameSessions.
     */
    data: GameSessionCreateManyInput | GameSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GameSession update
   */
  export type GameSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSession
     */
    select?: GameSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSession
     */
    omit?: GameSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a GameSession.
     */
    data: XOR<GameSessionUpdateInput, GameSessionUncheckedUpdateInput>
    /**
     * Choose, which GameSession to update.
     */
    where: GameSessionWhereUniqueInput
  }

  /**
   * GameSession updateMany
   */
  export type GameSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GameSessions.
     */
    data: XOR<GameSessionUpdateManyMutationInput, GameSessionUncheckedUpdateManyInput>
    /**
     * Filter which GameSessions to update
     */
    where?: GameSessionWhereInput
    /**
     * Limit how many GameSessions to update.
     */
    limit?: number
  }

  /**
   * GameSession updateManyAndReturn
   */
  export type GameSessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSession
     */
    select?: GameSessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GameSession
     */
    omit?: GameSessionOmit<ExtArgs> | null
    /**
     * The data used to update GameSessions.
     */
    data: XOR<GameSessionUpdateManyMutationInput, GameSessionUncheckedUpdateManyInput>
    /**
     * Filter which GameSessions to update
     */
    where?: GameSessionWhereInput
    /**
     * Limit how many GameSessions to update.
     */
    limit?: number
  }

  /**
   * GameSession upsert
   */
  export type GameSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSession
     */
    select?: GameSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSession
     */
    omit?: GameSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the GameSession to update in case it exists.
     */
    where: GameSessionWhereUniqueInput
    /**
     * In case the GameSession found by the `where` argument doesn't exist, create a new GameSession with this data.
     */
    create: XOR<GameSessionCreateInput, GameSessionUncheckedCreateInput>
    /**
     * In case the GameSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GameSessionUpdateInput, GameSessionUncheckedUpdateInput>
  }

  /**
   * GameSession delete
   */
  export type GameSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSession
     */
    select?: GameSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSession
     */
    omit?: GameSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameSessionInclude<ExtArgs> | null
    /**
     * Filter which GameSession to delete.
     */
    where: GameSessionWhereUniqueInput
  }

  /**
   * GameSession deleteMany
   */
  export type GameSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GameSessions to delete
     */
    where?: GameSessionWhereInput
    /**
     * Limit how many GameSessions to delete.
     */
    limit?: number
  }

  /**
   * GameSession.participants
   */
  export type GameSession$participantsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameParticipant
     */
    select?: GameParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameParticipant
     */
    omit?: GameParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameParticipantInclude<ExtArgs> | null
    where?: GameParticipantWhereInput
    orderBy?: GameParticipantOrderByWithRelationInput | GameParticipantOrderByWithRelationInput[]
    cursor?: GameParticipantWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GameParticipantScalarFieldEnum | GameParticipantScalarFieldEnum[]
  }

  /**
   * GameSession.rounds
   */
  export type GameSession$roundsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRound
     */
    select?: GameRoundSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameRound
     */
    omit?: GameRoundOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameRoundInclude<ExtArgs> | null
    where?: GameRoundWhereInput
    orderBy?: GameRoundOrderByWithRelationInput | GameRoundOrderByWithRelationInput[]
    cursor?: GameRoundWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GameRoundScalarFieldEnum | GameRoundScalarFieldEnum[]
  }

  /**
   * GameSession without action
   */
  export type GameSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameSession
     */
    select?: GameSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameSession
     */
    omit?: GameSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameSessionInclude<ExtArgs> | null
  }


  /**
   * Model GameParticipant
   */

  export type AggregateGameParticipant = {
    _count: GameParticipantCountAggregateOutputType | null
    _avg: GameParticipantAvgAggregateOutputType | null
    _sum: GameParticipantSumAggregateOutputType | null
    _min: GameParticipantMinAggregateOutputType | null
    _max: GameParticipantMaxAggregateOutputType | null
  }

  export type GameParticipantAvgAggregateOutputType = {
    position: number | null
    finalScore: number | null
    finalRank: number | null
    mistakeCount: number | null
  }

  export type GameParticipantSumAggregateOutputType = {
    position: number | null
    finalScore: number | null
    finalRank: number | null
    mistakeCount: number | null
  }

  export type GameParticipantMinAggregateOutputType = {
    id: string | null
    gameSessionId: string | null
    userId: string | null
    position: number | null
    isReady: boolean | null
    isConnected: boolean | null
    finalScore: number | null
    finalRank: number | null
    mistakeCount: number | null
    joinedAt: Date | null
    leftAt: Date | null
  }

  export type GameParticipantMaxAggregateOutputType = {
    id: string | null
    gameSessionId: string | null
    userId: string | null
    position: number | null
    isReady: boolean | null
    isConnected: boolean | null
    finalScore: number | null
    finalRank: number | null
    mistakeCount: number | null
    joinedAt: Date | null
    leftAt: Date | null
  }

  export type GameParticipantCountAggregateOutputType = {
    id: number
    gameSessionId: number
    userId: number
    position: number
    isReady: number
    isConnected: number
    finalScore: number
    finalRank: number
    mistakeCount: number
    joinedAt: number
    leftAt: number
    _all: number
  }


  export type GameParticipantAvgAggregateInputType = {
    position?: true
    finalScore?: true
    finalRank?: true
    mistakeCount?: true
  }

  export type GameParticipantSumAggregateInputType = {
    position?: true
    finalScore?: true
    finalRank?: true
    mistakeCount?: true
  }

  export type GameParticipantMinAggregateInputType = {
    id?: true
    gameSessionId?: true
    userId?: true
    position?: true
    isReady?: true
    isConnected?: true
    finalScore?: true
    finalRank?: true
    mistakeCount?: true
    joinedAt?: true
    leftAt?: true
  }

  export type GameParticipantMaxAggregateInputType = {
    id?: true
    gameSessionId?: true
    userId?: true
    position?: true
    isReady?: true
    isConnected?: true
    finalScore?: true
    finalRank?: true
    mistakeCount?: true
    joinedAt?: true
    leftAt?: true
  }

  export type GameParticipantCountAggregateInputType = {
    id?: true
    gameSessionId?: true
    userId?: true
    position?: true
    isReady?: true
    isConnected?: true
    finalScore?: true
    finalRank?: true
    mistakeCount?: true
    joinedAt?: true
    leftAt?: true
    _all?: true
  }

  export type GameParticipantAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GameParticipant to aggregate.
     */
    where?: GameParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameParticipants to fetch.
     */
    orderBy?: GameParticipantOrderByWithRelationInput | GameParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GameParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameParticipants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GameParticipants
    **/
    _count?: true | GameParticipantCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GameParticipantAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GameParticipantSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GameParticipantMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GameParticipantMaxAggregateInputType
  }

  export type GetGameParticipantAggregateType<T extends GameParticipantAggregateArgs> = {
        [P in keyof T & keyof AggregateGameParticipant]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGameParticipant[P]>
      : GetScalarType<T[P], AggregateGameParticipant[P]>
  }




  export type GameParticipantGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameParticipantWhereInput
    orderBy?: GameParticipantOrderByWithAggregationInput | GameParticipantOrderByWithAggregationInput[]
    by: GameParticipantScalarFieldEnum[] | GameParticipantScalarFieldEnum
    having?: GameParticipantScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GameParticipantCountAggregateInputType | true
    _avg?: GameParticipantAvgAggregateInputType
    _sum?: GameParticipantSumAggregateInputType
    _min?: GameParticipantMinAggregateInputType
    _max?: GameParticipantMaxAggregateInputType
  }

  export type GameParticipantGroupByOutputType = {
    id: string
    gameSessionId: string
    userId: string
    position: number
    isReady: boolean
    isConnected: boolean
    finalScore: number
    finalRank: number | null
    mistakeCount: number
    joinedAt: Date
    leftAt: Date | null
    _count: GameParticipantCountAggregateOutputType | null
    _avg: GameParticipantAvgAggregateOutputType | null
    _sum: GameParticipantSumAggregateOutputType | null
    _min: GameParticipantMinAggregateOutputType | null
    _max: GameParticipantMaxAggregateOutputType | null
  }

  type GetGameParticipantGroupByPayload<T extends GameParticipantGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GameParticipantGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GameParticipantGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GameParticipantGroupByOutputType[P]>
            : GetScalarType<T[P], GameParticipantGroupByOutputType[P]>
        }
      >
    >


  export type GameParticipantSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    gameSessionId?: boolean
    userId?: boolean
    position?: boolean
    isReady?: boolean
    isConnected?: boolean
    finalScore?: boolean
    finalRank?: boolean
    mistakeCount?: boolean
    joinedAt?: boolean
    leftAt?: boolean
    gameSession?: boolean | GameSessionDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    scores?: boolean | GameParticipant$scoresArgs<ExtArgs>
    _count?: boolean | GameParticipantCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gameParticipant"]>

  export type GameParticipantSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    gameSessionId?: boolean
    userId?: boolean
    position?: boolean
    isReady?: boolean
    isConnected?: boolean
    finalScore?: boolean
    finalRank?: boolean
    mistakeCount?: boolean
    joinedAt?: boolean
    leftAt?: boolean
    gameSession?: boolean | GameSessionDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gameParticipant"]>

  export type GameParticipantSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    gameSessionId?: boolean
    userId?: boolean
    position?: boolean
    isReady?: boolean
    isConnected?: boolean
    finalScore?: boolean
    finalRank?: boolean
    mistakeCount?: boolean
    joinedAt?: boolean
    leftAt?: boolean
    gameSession?: boolean | GameSessionDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gameParticipant"]>

  export type GameParticipantSelectScalar = {
    id?: boolean
    gameSessionId?: boolean
    userId?: boolean
    position?: boolean
    isReady?: boolean
    isConnected?: boolean
    finalScore?: boolean
    finalRank?: boolean
    mistakeCount?: boolean
    joinedAt?: boolean
    leftAt?: boolean
  }

  export type GameParticipantOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "gameSessionId" | "userId" | "position" | "isReady" | "isConnected" | "finalScore" | "finalRank" | "mistakeCount" | "joinedAt" | "leftAt", ExtArgs["result"]["gameParticipant"]>
  export type GameParticipantInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    gameSession?: boolean | GameSessionDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    scores?: boolean | GameParticipant$scoresArgs<ExtArgs>
    _count?: boolean | GameParticipantCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type GameParticipantIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    gameSession?: boolean | GameSessionDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type GameParticipantIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    gameSession?: boolean | GameSessionDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $GameParticipantPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GameParticipant"
    objects: {
      gameSession: Prisma.$GameSessionPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
      scores: Prisma.$GameScorePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      gameSessionId: string
      userId: string
      position: number
      isReady: boolean
      isConnected: boolean
      finalScore: number
      finalRank: number | null
      mistakeCount: number
      joinedAt: Date
      leftAt: Date | null
    }, ExtArgs["result"]["gameParticipant"]>
    composites: {}
  }

  type GameParticipantGetPayload<S extends boolean | null | undefined | GameParticipantDefaultArgs> = $Result.GetResult<Prisma.$GameParticipantPayload, S>

  type GameParticipantCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GameParticipantFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GameParticipantCountAggregateInputType | true
    }

  export interface GameParticipantDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GameParticipant'], meta: { name: 'GameParticipant' } }
    /**
     * Find zero or one GameParticipant that matches the filter.
     * @param {GameParticipantFindUniqueArgs} args - Arguments to find a GameParticipant
     * @example
     * // Get one GameParticipant
     * const gameParticipant = await prisma.gameParticipant.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GameParticipantFindUniqueArgs>(args: SelectSubset<T, GameParticipantFindUniqueArgs<ExtArgs>>): Prisma__GameParticipantClient<$Result.GetResult<Prisma.$GameParticipantPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GameParticipant that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GameParticipantFindUniqueOrThrowArgs} args - Arguments to find a GameParticipant
     * @example
     * // Get one GameParticipant
     * const gameParticipant = await prisma.gameParticipant.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GameParticipantFindUniqueOrThrowArgs>(args: SelectSubset<T, GameParticipantFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GameParticipantClient<$Result.GetResult<Prisma.$GameParticipantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GameParticipant that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameParticipantFindFirstArgs} args - Arguments to find a GameParticipant
     * @example
     * // Get one GameParticipant
     * const gameParticipant = await prisma.gameParticipant.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GameParticipantFindFirstArgs>(args?: SelectSubset<T, GameParticipantFindFirstArgs<ExtArgs>>): Prisma__GameParticipantClient<$Result.GetResult<Prisma.$GameParticipantPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GameParticipant that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameParticipantFindFirstOrThrowArgs} args - Arguments to find a GameParticipant
     * @example
     * // Get one GameParticipant
     * const gameParticipant = await prisma.gameParticipant.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GameParticipantFindFirstOrThrowArgs>(args?: SelectSubset<T, GameParticipantFindFirstOrThrowArgs<ExtArgs>>): Prisma__GameParticipantClient<$Result.GetResult<Prisma.$GameParticipantPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GameParticipants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameParticipantFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GameParticipants
     * const gameParticipants = await prisma.gameParticipant.findMany()
     * 
     * // Get first 10 GameParticipants
     * const gameParticipants = await prisma.gameParticipant.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const gameParticipantWithIdOnly = await prisma.gameParticipant.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GameParticipantFindManyArgs>(args?: SelectSubset<T, GameParticipantFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameParticipantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GameParticipant.
     * @param {GameParticipantCreateArgs} args - Arguments to create a GameParticipant.
     * @example
     * // Create one GameParticipant
     * const GameParticipant = await prisma.gameParticipant.create({
     *   data: {
     *     // ... data to create a GameParticipant
     *   }
     * })
     * 
     */
    create<T extends GameParticipantCreateArgs>(args: SelectSubset<T, GameParticipantCreateArgs<ExtArgs>>): Prisma__GameParticipantClient<$Result.GetResult<Prisma.$GameParticipantPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GameParticipants.
     * @param {GameParticipantCreateManyArgs} args - Arguments to create many GameParticipants.
     * @example
     * // Create many GameParticipants
     * const gameParticipant = await prisma.gameParticipant.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GameParticipantCreateManyArgs>(args?: SelectSubset<T, GameParticipantCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GameParticipants and returns the data saved in the database.
     * @param {GameParticipantCreateManyAndReturnArgs} args - Arguments to create many GameParticipants.
     * @example
     * // Create many GameParticipants
     * const gameParticipant = await prisma.gameParticipant.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GameParticipants and only return the `id`
     * const gameParticipantWithIdOnly = await prisma.gameParticipant.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GameParticipantCreateManyAndReturnArgs>(args?: SelectSubset<T, GameParticipantCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameParticipantPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a GameParticipant.
     * @param {GameParticipantDeleteArgs} args - Arguments to delete one GameParticipant.
     * @example
     * // Delete one GameParticipant
     * const GameParticipant = await prisma.gameParticipant.delete({
     *   where: {
     *     // ... filter to delete one GameParticipant
     *   }
     * })
     * 
     */
    delete<T extends GameParticipantDeleteArgs>(args: SelectSubset<T, GameParticipantDeleteArgs<ExtArgs>>): Prisma__GameParticipantClient<$Result.GetResult<Prisma.$GameParticipantPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GameParticipant.
     * @param {GameParticipantUpdateArgs} args - Arguments to update one GameParticipant.
     * @example
     * // Update one GameParticipant
     * const gameParticipant = await prisma.gameParticipant.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GameParticipantUpdateArgs>(args: SelectSubset<T, GameParticipantUpdateArgs<ExtArgs>>): Prisma__GameParticipantClient<$Result.GetResult<Prisma.$GameParticipantPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GameParticipants.
     * @param {GameParticipantDeleteManyArgs} args - Arguments to filter GameParticipants to delete.
     * @example
     * // Delete a few GameParticipants
     * const { count } = await prisma.gameParticipant.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GameParticipantDeleteManyArgs>(args?: SelectSubset<T, GameParticipantDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GameParticipants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameParticipantUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GameParticipants
     * const gameParticipant = await prisma.gameParticipant.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GameParticipantUpdateManyArgs>(args: SelectSubset<T, GameParticipantUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GameParticipants and returns the data updated in the database.
     * @param {GameParticipantUpdateManyAndReturnArgs} args - Arguments to update many GameParticipants.
     * @example
     * // Update many GameParticipants
     * const gameParticipant = await prisma.gameParticipant.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more GameParticipants and only return the `id`
     * const gameParticipantWithIdOnly = await prisma.gameParticipant.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GameParticipantUpdateManyAndReturnArgs>(args: SelectSubset<T, GameParticipantUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameParticipantPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one GameParticipant.
     * @param {GameParticipantUpsertArgs} args - Arguments to update or create a GameParticipant.
     * @example
     * // Update or create a GameParticipant
     * const gameParticipant = await prisma.gameParticipant.upsert({
     *   create: {
     *     // ... data to create a GameParticipant
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GameParticipant we want to update
     *   }
     * })
     */
    upsert<T extends GameParticipantUpsertArgs>(args: SelectSubset<T, GameParticipantUpsertArgs<ExtArgs>>): Prisma__GameParticipantClient<$Result.GetResult<Prisma.$GameParticipantPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GameParticipants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameParticipantCountArgs} args - Arguments to filter GameParticipants to count.
     * @example
     * // Count the number of GameParticipants
     * const count = await prisma.gameParticipant.count({
     *   where: {
     *     // ... the filter for the GameParticipants we want to count
     *   }
     * })
    **/
    count<T extends GameParticipantCountArgs>(
      args?: Subset<T, GameParticipantCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GameParticipantCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GameParticipant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameParticipantAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GameParticipantAggregateArgs>(args: Subset<T, GameParticipantAggregateArgs>): Prisma.PrismaPromise<GetGameParticipantAggregateType<T>>

    /**
     * Group by GameParticipant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameParticipantGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GameParticipantGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GameParticipantGroupByArgs['orderBy'] }
        : { orderBy?: GameParticipantGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GameParticipantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGameParticipantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GameParticipant model
   */
  readonly fields: GameParticipantFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GameParticipant.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GameParticipantClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    gameSession<T extends GameSessionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, GameSessionDefaultArgs<ExtArgs>>): Prisma__GameSessionClient<$Result.GetResult<Prisma.$GameSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    scores<T extends GameParticipant$scoresArgs<ExtArgs> = {}>(args?: Subset<T, GameParticipant$scoresArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameScorePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GameParticipant model
   */
  interface GameParticipantFieldRefs {
    readonly id: FieldRef<"GameParticipant", 'String'>
    readonly gameSessionId: FieldRef<"GameParticipant", 'String'>
    readonly userId: FieldRef<"GameParticipant", 'String'>
    readonly position: FieldRef<"GameParticipant", 'Int'>
    readonly isReady: FieldRef<"GameParticipant", 'Boolean'>
    readonly isConnected: FieldRef<"GameParticipant", 'Boolean'>
    readonly finalScore: FieldRef<"GameParticipant", 'Int'>
    readonly finalRank: FieldRef<"GameParticipant", 'Int'>
    readonly mistakeCount: FieldRef<"GameParticipant", 'Int'>
    readonly joinedAt: FieldRef<"GameParticipant", 'DateTime'>
    readonly leftAt: FieldRef<"GameParticipant", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GameParticipant findUnique
   */
  export type GameParticipantFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameParticipant
     */
    select?: GameParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameParticipant
     */
    omit?: GameParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameParticipantInclude<ExtArgs> | null
    /**
     * Filter, which GameParticipant to fetch.
     */
    where: GameParticipantWhereUniqueInput
  }

  /**
   * GameParticipant findUniqueOrThrow
   */
  export type GameParticipantFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameParticipant
     */
    select?: GameParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameParticipant
     */
    omit?: GameParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameParticipantInclude<ExtArgs> | null
    /**
     * Filter, which GameParticipant to fetch.
     */
    where: GameParticipantWhereUniqueInput
  }

  /**
   * GameParticipant findFirst
   */
  export type GameParticipantFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameParticipant
     */
    select?: GameParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameParticipant
     */
    omit?: GameParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameParticipantInclude<ExtArgs> | null
    /**
     * Filter, which GameParticipant to fetch.
     */
    where?: GameParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameParticipants to fetch.
     */
    orderBy?: GameParticipantOrderByWithRelationInput | GameParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GameParticipants.
     */
    cursor?: GameParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameParticipants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GameParticipants.
     */
    distinct?: GameParticipantScalarFieldEnum | GameParticipantScalarFieldEnum[]
  }

  /**
   * GameParticipant findFirstOrThrow
   */
  export type GameParticipantFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameParticipant
     */
    select?: GameParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameParticipant
     */
    omit?: GameParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameParticipantInclude<ExtArgs> | null
    /**
     * Filter, which GameParticipant to fetch.
     */
    where?: GameParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameParticipants to fetch.
     */
    orderBy?: GameParticipantOrderByWithRelationInput | GameParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GameParticipants.
     */
    cursor?: GameParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameParticipants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GameParticipants.
     */
    distinct?: GameParticipantScalarFieldEnum | GameParticipantScalarFieldEnum[]
  }

  /**
   * GameParticipant findMany
   */
  export type GameParticipantFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameParticipant
     */
    select?: GameParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameParticipant
     */
    omit?: GameParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameParticipantInclude<ExtArgs> | null
    /**
     * Filter, which GameParticipants to fetch.
     */
    where?: GameParticipantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameParticipants to fetch.
     */
    orderBy?: GameParticipantOrderByWithRelationInput | GameParticipantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GameParticipants.
     */
    cursor?: GameParticipantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameParticipants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameParticipants.
     */
    skip?: number
    distinct?: GameParticipantScalarFieldEnum | GameParticipantScalarFieldEnum[]
  }

  /**
   * GameParticipant create
   */
  export type GameParticipantCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameParticipant
     */
    select?: GameParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameParticipant
     */
    omit?: GameParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameParticipantInclude<ExtArgs> | null
    /**
     * The data needed to create a GameParticipant.
     */
    data: XOR<GameParticipantCreateInput, GameParticipantUncheckedCreateInput>
  }

  /**
   * GameParticipant createMany
   */
  export type GameParticipantCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GameParticipants.
     */
    data: GameParticipantCreateManyInput | GameParticipantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GameParticipant createManyAndReturn
   */
  export type GameParticipantCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameParticipant
     */
    select?: GameParticipantSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GameParticipant
     */
    omit?: GameParticipantOmit<ExtArgs> | null
    /**
     * The data used to create many GameParticipants.
     */
    data: GameParticipantCreateManyInput | GameParticipantCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameParticipantIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * GameParticipant update
   */
  export type GameParticipantUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameParticipant
     */
    select?: GameParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameParticipant
     */
    omit?: GameParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameParticipantInclude<ExtArgs> | null
    /**
     * The data needed to update a GameParticipant.
     */
    data: XOR<GameParticipantUpdateInput, GameParticipantUncheckedUpdateInput>
    /**
     * Choose, which GameParticipant to update.
     */
    where: GameParticipantWhereUniqueInput
  }

  /**
   * GameParticipant updateMany
   */
  export type GameParticipantUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GameParticipants.
     */
    data: XOR<GameParticipantUpdateManyMutationInput, GameParticipantUncheckedUpdateManyInput>
    /**
     * Filter which GameParticipants to update
     */
    where?: GameParticipantWhereInput
    /**
     * Limit how many GameParticipants to update.
     */
    limit?: number
  }

  /**
   * GameParticipant updateManyAndReturn
   */
  export type GameParticipantUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameParticipant
     */
    select?: GameParticipantSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GameParticipant
     */
    omit?: GameParticipantOmit<ExtArgs> | null
    /**
     * The data used to update GameParticipants.
     */
    data: XOR<GameParticipantUpdateManyMutationInput, GameParticipantUncheckedUpdateManyInput>
    /**
     * Filter which GameParticipants to update
     */
    where?: GameParticipantWhereInput
    /**
     * Limit how many GameParticipants to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameParticipantIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * GameParticipant upsert
   */
  export type GameParticipantUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameParticipant
     */
    select?: GameParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameParticipant
     */
    omit?: GameParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameParticipantInclude<ExtArgs> | null
    /**
     * The filter to search for the GameParticipant to update in case it exists.
     */
    where: GameParticipantWhereUniqueInput
    /**
     * In case the GameParticipant found by the `where` argument doesn't exist, create a new GameParticipant with this data.
     */
    create: XOR<GameParticipantCreateInput, GameParticipantUncheckedCreateInput>
    /**
     * In case the GameParticipant was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GameParticipantUpdateInput, GameParticipantUncheckedUpdateInput>
  }

  /**
   * GameParticipant delete
   */
  export type GameParticipantDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameParticipant
     */
    select?: GameParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameParticipant
     */
    omit?: GameParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameParticipantInclude<ExtArgs> | null
    /**
     * Filter which GameParticipant to delete.
     */
    where: GameParticipantWhereUniqueInput
  }

  /**
   * GameParticipant deleteMany
   */
  export type GameParticipantDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GameParticipants to delete
     */
    where?: GameParticipantWhereInput
    /**
     * Limit how many GameParticipants to delete.
     */
    limit?: number
  }

  /**
   * GameParticipant.scores
   */
  export type GameParticipant$scoresArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameScore
     */
    select?: GameScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameScore
     */
    omit?: GameScoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameScoreInclude<ExtArgs> | null
    where?: GameScoreWhereInput
    orderBy?: GameScoreOrderByWithRelationInput | GameScoreOrderByWithRelationInput[]
    cursor?: GameScoreWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GameScoreScalarFieldEnum | GameScoreScalarFieldEnum[]
  }

  /**
   * GameParticipant without action
   */
  export type GameParticipantDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameParticipant
     */
    select?: GameParticipantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameParticipant
     */
    omit?: GameParticipantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameParticipantInclude<ExtArgs> | null
  }


  /**
   * Model GameRound
   */

  export type AggregateGameRound = {
    _count: GameRoundCountAggregateOutputType | null
    _avg: GameRoundAvgAggregateOutputType | null
    _sum: GameRoundSumAggregateOutputType | null
    _min: GameRoundMinAggregateOutputType | null
    _max: GameRoundMaxAggregateOutputType | null
  }

  export type GameRoundAvgAggregateOutputType = {
    roundNumber: number | null
  }

  export type GameRoundSumAggregateOutputType = {
    roundNumber: number | null
  }

  export type GameRoundMinAggregateOutputType = {
    id: string | null
    gameSessionId: string | null
    roundNumber: number | null
    verse: string | null
    correctBook: string | null
    correctRef: string | null
    context: string | null
    startedAt: Date | null
    endedAt: Date | null
  }

  export type GameRoundMaxAggregateOutputType = {
    id: string | null
    gameSessionId: string | null
    roundNumber: number | null
    verse: string | null
    correctBook: string | null
    correctRef: string | null
    context: string | null
    startedAt: Date | null
    endedAt: Date | null
  }

  export type GameRoundCountAggregateOutputType = {
    id: number
    gameSessionId: number
    roundNumber: number
    verse: number
    blanks: number
    emojiMapping: number
    correctBook: number
    correctRef: number
    context: number
    startedAt: number
    endedAt: number
    _all: number
  }


  export type GameRoundAvgAggregateInputType = {
    roundNumber?: true
  }

  export type GameRoundSumAggregateInputType = {
    roundNumber?: true
  }

  export type GameRoundMinAggregateInputType = {
    id?: true
    gameSessionId?: true
    roundNumber?: true
    verse?: true
    correctBook?: true
    correctRef?: true
    context?: true
    startedAt?: true
    endedAt?: true
  }

  export type GameRoundMaxAggregateInputType = {
    id?: true
    gameSessionId?: true
    roundNumber?: true
    verse?: true
    correctBook?: true
    correctRef?: true
    context?: true
    startedAt?: true
    endedAt?: true
  }

  export type GameRoundCountAggregateInputType = {
    id?: true
    gameSessionId?: true
    roundNumber?: true
    verse?: true
    blanks?: true
    emojiMapping?: true
    correctBook?: true
    correctRef?: true
    context?: true
    startedAt?: true
    endedAt?: true
    _all?: true
  }

  export type GameRoundAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GameRound to aggregate.
     */
    where?: GameRoundWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameRounds to fetch.
     */
    orderBy?: GameRoundOrderByWithRelationInput | GameRoundOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GameRoundWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameRounds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameRounds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GameRounds
    **/
    _count?: true | GameRoundCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GameRoundAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GameRoundSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GameRoundMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GameRoundMaxAggregateInputType
  }

  export type GetGameRoundAggregateType<T extends GameRoundAggregateArgs> = {
        [P in keyof T & keyof AggregateGameRound]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGameRound[P]>
      : GetScalarType<T[P], AggregateGameRound[P]>
  }




  export type GameRoundGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameRoundWhereInput
    orderBy?: GameRoundOrderByWithAggregationInput | GameRoundOrderByWithAggregationInput[]
    by: GameRoundScalarFieldEnum[] | GameRoundScalarFieldEnum
    having?: GameRoundScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GameRoundCountAggregateInputType | true
    _avg?: GameRoundAvgAggregateInputType
    _sum?: GameRoundSumAggregateInputType
    _min?: GameRoundMinAggregateInputType
    _max?: GameRoundMaxAggregateInputType
  }

  export type GameRoundGroupByOutputType = {
    id: string
    gameSessionId: string
    roundNumber: number
    verse: string
    blanks: JsonValue
    emojiMapping: JsonValue
    correctBook: string
    correctRef: string
    context: string | null
    startedAt: Date | null
    endedAt: Date | null
    _count: GameRoundCountAggregateOutputType | null
    _avg: GameRoundAvgAggregateOutputType | null
    _sum: GameRoundSumAggregateOutputType | null
    _min: GameRoundMinAggregateOutputType | null
    _max: GameRoundMaxAggregateOutputType | null
  }

  type GetGameRoundGroupByPayload<T extends GameRoundGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GameRoundGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GameRoundGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GameRoundGroupByOutputType[P]>
            : GetScalarType<T[P], GameRoundGroupByOutputType[P]>
        }
      >
    >


  export type GameRoundSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    gameSessionId?: boolean
    roundNumber?: boolean
    verse?: boolean
    blanks?: boolean
    emojiMapping?: boolean
    correctBook?: boolean
    correctRef?: boolean
    context?: boolean
    startedAt?: boolean
    endedAt?: boolean
    gameSession?: boolean | GameSessionDefaultArgs<ExtArgs>
    scores?: boolean | GameRound$scoresArgs<ExtArgs>
    _count?: boolean | GameRoundCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gameRound"]>

  export type GameRoundSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    gameSessionId?: boolean
    roundNumber?: boolean
    verse?: boolean
    blanks?: boolean
    emojiMapping?: boolean
    correctBook?: boolean
    correctRef?: boolean
    context?: boolean
    startedAt?: boolean
    endedAt?: boolean
    gameSession?: boolean | GameSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gameRound"]>

  export type GameRoundSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    gameSessionId?: boolean
    roundNumber?: boolean
    verse?: boolean
    blanks?: boolean
    emojiMapping?: boolean
    correctBook?: boolean
    correctRef?: boolean
    context?: boolean
    startedAt?: boolean
    endedAt?: boolean
    gameSession?: boolean | GameSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gameRound"]>

  export type GameRoundSelectScalar = {
    id?: boolean
    gameSessionId?: boolean
    roundNumber?: boolean
    verse?: boolean
    blanks?: boolean
    emojiMapping?: boolean
    correctBook?: boolean
    correctRef?: boolean
    context?: boolean
    startedAt?: boolean
    endedAt?: boolean
  }

  export type GameRoundOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "gameSessionId" | "roundNumber" | "verse" | "blanks" | "emojiMapping" | "correctBook" | "correctRef" | "context" | "startedAt" | "endedAt", ExtArgs["result"]["gameRound"]>
  export type GameRoundInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    gameSession?: boolean | GameSessionDefaultArgs<ExtArgs>
    scores?: boolean | GameRound$scoresArgs<ExtArgs>
    _count?: boolean | GameRoundCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type GameRoundIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    gameSession?: boolean | GameSessionDefaultArgs<ExtArgs>
  }
  export type GameRoundIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    gameSession?: boolean | GameSessionDefaultArgs<ExtArgs>
  }

  export type $GameRoundPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GameRound"
    objects: {
      gameSession: Prisma.$GameSessionPayload<ExtArgs>
      scores: Prisma.$GameScorePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      gameSessionId: string
      roundNumber: number
      verse: string
      blanks: Prisma.JsonValue
      emojiMapping: Prisma.JsonValue
      correctBook: string
      correctRef: string
      context: string | null
      startedAt: Date | null
      endedAt: Date | null
    }, ExtArgs["result"]["gameRound"]>
    composites: {}
  }

  type GameRoundGetPayload<S extends boolean | null | undefined | GameRoundDefaultArgs> = $Result.GetResult<Prisma.$GameRoundPayload, S>

  type GameRoundCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GameRoundFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GameRoundCountAggregateInputType | true
    }

  export interface GameRoundDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GameRound'], meta: { name: 'GameRound' } }
    /**
     * Find zero or one GameRound that matches the filter.
     * @param {GameRoundFindUniqueArgs} args - Arguments to find a GameRound
     * @example
     * // Get one GameRound
     * const gameRound = await prisma.gameRound.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GameRoundFindUniqueArgs>(args: SelectSubset<T, GameRoundFindUniqueArgs<ExtArgs>>): Prisma__GameRoundClient<$Result.GetResult<Prisma.$GameRoundPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GameRound that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GameRoundFindUniqueOrThrowArgs} args - Arguments to find a GameRound
     * @example
     * // Get one GameRound
     * const gameRound = await prisma.gameRound.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GameRoundFindUniqueOrThrowArgs>(args: SelectSubset<T, GameRoundFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GameRoundClient<$Result.GetResult<Prisma.$GameRoundPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GameRound that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameRoundFindFirstArgs} args - Arguments to find a GameRound
     * @example
     * // Get one GameRound
     * const gameRound = await prisma.gameRound.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GameRoundFindFirstArgs>(args?: SelectSubset<T, GameRoundFindFirstArgs<ExtArgs>>): Prisma__GameRoundClient<$Result.GetResult<Prisma.$GameRoundPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GameRound that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameRoundFindFirstOrThrowArgs} args - Arguments to find a GameRound
     * @example
     * // Get one GameRound
     * const gameRound = await prisma.gameRound.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GameRoundFindFirstOrThrowArgs>(args?: SelectSubset<T, GameRoundFindFirstOrThrowArgs<ExtArgs>>): Prisma__GameRoundClient<$Result.GetResult<Prisma.$GameRoundPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GameRounds that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameRoundFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GameRounds
     * const gameRounds = await prisma.gameRound.findMany()
     * 
     * // Get first 10 GameRounds
     * const gameRounds = await prisma.gameRound.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const gameRoundWithIdOnly = await prisma.gameRound.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GameRoundFindManyArgs>(args?: SelectSubset<T, GameRoundFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameRoundPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GameRound.
     * @param {GameRoundCreateArgs} args - Arguments to create a GameRound.
     * @example
     * // Create one GameRound
     * const GameRound = await prisma.gameRound.create({
     *   data: {
     *     // ... data to create a GameRound
     *   }
     * })
     * 
     */
    create<T extends GameRoundCreateArgs>(args: SelectSubset<T, GameRoundCreateArgs<ExtArgs>>): Prisma__GameRoundClient<$Result.GetResult<Prisma.$GameRoundPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GameRounds.
     * @param {GameRoundCreateManyArgs} args - Arguments to create many GameRounds.
     * @example
     * // Create many GameRounds
     * const gameRound = await prisma.gameRound.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GameRoundCreateManyArgs>(args?: SelectSubset<T, GameRoundCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GameRounds and returns the data saved in the database.
     * @param {GameRoundCreateManyAndReturnArgs} args - Arguments to create many GameRounds.
     * @example
     * // Create many GameRounds
     * const gameRound = await prisma.gameRound.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GameRounds and only return the `id`
     * const gameRoundWithIdOnly = await prisma.gameRound.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GameRoundCreateManyAndReturnArgs>(args?: SelectSubset<T, GameRoundCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameRoundPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a GameRound.
     * @param {GameRoundDeleteArgs} args - Arguments to delete one GameRound.
     * @example
     * // Delete one GameRound
     * const GameRound = await prisma.gameRound.delete({
     *   where: {
     *     // ... filter to delete one GameRound
     *   }
     * })
     * 
     */
    delete<T extends GameRoundDeleteArgs>(args: SelectSubset<T, GameRoundDeleteArgs<ExtArgs>>): Prisma__GameRoundClient<$Result.GetResult<Prisma.$GameRoundPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GameRound.
     * @param {GameRoundUpdateArgs} args - Arguments to update one GameRound.
     * @example
     * // Update one GameRound
     * const gameRound = await prisma.gameRound.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GameRoundUpdateArgs>(args: SelectSubset<T, GameRoundUpdateArgs<ExtArgs>>): Prisma__GameRoundClient<$Result.GetResult<Prisma.$GameRoundPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GameRounds.
     * @param {GameRoundDeleteManyArgs} args - Arguments to filter GameRounds to delete.
     * @example
     * // Delete a few GameRounds
     * const { count } = await prisma.gameRound.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GameRoundDeleteManyArgs>(args?: SelectSubset<T, GameRoundDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GameRounds.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameRoundUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GameRounds
     * const gameRound = await prisma.gameRound.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GameRoundUpdateManyArgs>(args: SelectSubset<T, GameRoundUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GameRounds and returns the data updated in the database.
     * @param {GameRoundUpdateManyAndReturnArgs} args - Arguments to update many GameRounds.
     * @example
     * // Update many GameRounds
     * const gameRound = await prisma.gameRound.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more GameRounds and only return the `id`
     * const gameRoundWithIdOnly = await prisma.gameRound.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GameRoundUpdateManyAndReturnArgs>(args: SelectSubset<T, GameRoundUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameRoundPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one GameRound.
     * @param {GameRoundUpsertArgs} args - Arguments to update or create a GameRound.
     * @example
     * // Update or create a GameRound
     * const gameRound = await prisma.gameRound.upsert({
     *   create: {
     *     // ... data to create a GameRound
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GameRound we want to update
     *   }
     * })
     */
    upsert<T extends GameRoundUpsertArgs>(args: SelectSubset<T, GameRoundUpsertArgs<ExtArgs>>): Prisma__GameRoundClient<$Result.GetResult<Prisma.$GameRoundPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GameRounds.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameRoundCountArgs} args - Arguments to filter GameRounds to count.
     * @example
     * // Count the number of GameRounds
     * const count = await prisma.gameRound.count({
     *   where: {
     *     // ... the filter for the GameRounds we want to count
     *   }
     * })
    **/
    count<T extends GameRoundCountArgs>(
      args?: Subset<T, GameRoundCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GameRoundCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GameRound.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameRoundAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GameRoundAggregateArgs>(args: Subset<T, GameRoundAggregateArgs>): Prisma.PrismaPromise<GetGameRoundAggregateType<T>>

    /**
     * Group by GameRound.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameRoundGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GameRoundGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GameRoundGroupByArgs['orderBy'] }
        : { orderBy?: GameRoundGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GameRoundGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGameRoundGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GameRound model
   */
  readonly fields: GameRoundFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GameRound.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GameRoundClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    gameSession<T extends GameSessionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, GameSessionDefaultArgs<ExtArgs>>): Prisma__GameSessionClient<$Result.GetResult<Prisma.$GameSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    scores<T extends GameRound$scoresArgs<ExtArgs> = {}>(args?: Subset<T, GameRound$scoresArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameScorePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GameRound model
   */
  interface GameRoundFieldRefs {
    readonly id: FieldRef<"GameRound", 'String'>
    readonly gameSessionId: FieldRef<"GameRound", 'String'>
    readonly roundNumber: FieldRef<"GameRound", 'Int'>
    readonly verse: FieldRef<"GameRound", 'String'>
    readonly blanks: FieldRef<"GameRound", 'Json'>
    readonly emojiMapping: FieldRef<"GameRound", 'Json'>
    readonly correctBook: FieldRef<"GameRound", 'String'>
    readonly correctRef: FieldRef<"GameRound", 'String'>
    readonly context: FieldRef<"GameRound", 'String'>
    readonly startedAt: FieldRef<"GameRound", 'DateTime'>
    readonly endedAt: FieldRef<"GameRound", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GameRound findUnique
   */
  export type GameRoundFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRound
     */
    select?: GameRoundSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameRound
     */
    omit?: GameRoundOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameRoundInclude<ExtArgs> | null
    /**
     * Filter, which GameRound to fetch.
     */
    where: GameRoundWhereUniqueInput
  }

  /**
   * GameRound findUniqueOrThrow
   */
  export type GameRoundFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRound
     */
    select?: GameRoundSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameRound
     */
    omit?: GameRoundOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameRoundInclude<ExtArgs> | null
    /**
     * Filter, which GameRound to fetch.
     */
    where: GameRoundWhereUniqueInput
  }

  /**
   * GameRound findFirst
   */
  export type GameRoundFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRound
     */
    select?: GameRoundSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameRound
     */
    omit?: GameRoundOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameRoundInclude<ExtArgs> | null
    /**
     * Filter, which GameRound to fetch.
     */
    where?: GameRoundWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameRounds to fetch.
     */
    orderBy?: GameRoundOrderByWithRelationInput | GameRoundOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GameRounds.
     */
    cursor?: GameRoundWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameRounds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameRounds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GameRounds.
     */
    distinct?: GameRoundScalarFieldEnum | GameRoundScalarFieldEnum[]
  }

  /**
   * GameRound findFirstOrThrow
   */
  export type GameRoundFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRound
     */
    select?: GameRoundSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameRound
     */
    omit?: GameRoundOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameRoundInclude<ExtArgs> | null
    /**
     * Filter, which GameRound to fetch.
     */
    where?: GameRoundWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameRounds to fetch.
     */
    orderBy?: GameRoundOrderByWithRelationInput | GameRoundOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GameRounds.
     */
    cursor?: GameRoundWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameRounds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameRounds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GameRounds.
     */
    distinct?: GameRoundScalarFieldEnum | GameRoundScalarFieldEnum[]
  }

  /**
   * GameRound findMany
   */
  export type GameRoundFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRound
     */
    select?: GameRoundSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameRound
     */
    omit?: GameRoundOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameRoundInclude<ExtArgs> | null
    /**
     * Filter, which GameRounds to fetch.
     */
    where?: GameRoundWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameRounds to fetch.
     */
    orderBy?: GameRoundOrderByWithRelationInput | GameRoundOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GameRounds.
     */
    cursor?: GameRoundWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameRounds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameRounds.
     */
    skip?: number
    distinct?: GameRoundScalarFieldEnum | GameRoundScalarFieldEnum[]
  }

  /**
   * GameRound create
   */
  export type GameRoundCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRound
     */
    select?: GameRoundSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameRound
     */
    omit?: GameRoundOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameRoundInclude<ExtArgs> | null
    /**
     * The data needed to create a GameRound.
     */
    data: XOR<GameRoundCreateInput, GameRoundUncheckedCreateInput>
  }

  /**
   * GameRound createMany
   */
  export type GameRoundCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GameRounds.
     */
    data: GameRoundCreateManyInput | GameRoundCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GameRound createManyAndReturn
   */
  export type GameRoundCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRound
     */
    select?: GameRoundSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GameRound
     */
    omit?: GameRoundOmit<ExtArgs> | null
    /**
     * The data used to create many GameRounds.
     */
    data: GameRoundCreateManyInput | GameRoundCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameRoundIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * GameRound update
   */
  export type GameRoundUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRound
     */
    select?: GameRoundSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameRound
     */
    omit?: GameRoundOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameRoundInclude<ExtArgs> | null
    /**
     * The data needed to update a GameRound.
     */
    data: XOR<GameRoundUpdateInput, GameRoundUncheckedUpdateInput>
    /**
     * Choose, which GameRound to update.
     */
    where: GameRoundWhereUniqueInput
  }

  /**
   * GameRound updateMany
   */
  export type GameRoundUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GameRounds.
     */
    data: XOR<GameRoundUpdateManyMutationInput, GameRoundUncheckedUpdateManyInput>
    /**
     * Filter which GameRounds to update
     */
    where?: GameRoundWhereInput
    /**
     * Limit how many GameRounds to update.
     */
    limit?: number
  }

  /**
   * GameRound updateManyAndReturn
   */
  export type GameRoundUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRound
     */
    select?: GameRoundSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GameRound
     */
    omit?: GameRoundOmit<ExtArgs> | null
    /**
     * The data used to update GameRounds.
     */
    data: XOR<GameRoundUpdateManyMutationInput, GameRoundUncheckedUpdateManyInput>
    /**
     * Filter which GameRounds to update
     */
    where?: GameRoundWhereInput
    /**
     * Limit how many GameRounds to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameRoundIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * GameRound upsert
   */
  export type GameRoundUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRound
     */
    select?: GameRoundSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameRound
     */
    omit?: GameRoundOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameRoundInclude<ExtArgs> | null
    /**
     * The filter to search for the GameRound to update in case it exists.
     */
    where: GameRoundWhereUniqueInput
    /**
     * In case the GameRound found by the `where` argument doesn't exist, create a new GameRound with this data.
     */
    create: XOR<GameRoundCreateInput, GameRoundUncheckedCreateInput>
    /**
     * In case the GameRound was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GameRoundUpdateInput, GameRoundUncheckedUpdateInput>
  }

  /**
   * GameRound delete
   */
  export type GameRoundDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRound
     */
    select?: GameRoundSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameRound
     */
    omit?: GameRoundOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameRoundInclude<ExtArgs> | null
    /**
     * Filter which GameRound to delete.
     */
    where: GameRoundWhereUniqueInput
  }

  /**
   * GameRound deleteMany
   */
  export type GameRoundDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GameRounds to delete
     */
    where?: GameRoundWhereInput
    /**
     * Limit how many GameRounds to delete.
     */
    limit?: number
  }

  /**
   * GameRound.scores
   */
  export type GameRound$scoresArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameScore
     */
    select?: GameScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameScore
     */
    omit?: GameScoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameScoreInclude<ExtArgs> | null
    where?: GameScoreWhereInput
    orderBy?: GameScoreOrderByWithRelationInput | GameScoreOrderByWithRelationInput[]
    cursor?: GameScoreWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GameScoreScalarFieldEnum | GameScoreScalarFieldEnum[]
  }

  /**
   * GameRound without action
   */
  export type GameRoundDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameRound
     */
    select?: GameRoundSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameRound
     */
    omit?: GameRoundOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameRoundInclude<ExtArgs> | null
  }


  /**
   * Model GameScore
   */

  export type AggregateGameScore = {
    _count: GameScoreCountAggregateOutputType | null
    _avg: GameScoreAvgAggregateOutputType | null
    _sum: GameScoreSumAggregateOutputType | null
    _min: GameScoreMinAggregateOutputType | null
    _max: GameScoreMaxAggregateOutputType | null
  }

  export type GameScoreAvgAggregateOutputType = {
    blanksScore: number | null
    contextScore: number | null
    bookScore: number | null
    referenceScore: number | null
    timeBonus: number | null
    streakBonus: number | null
    totalScore: number | null
    timeSpent: number | null
    mistakesMade: number | null
    hintsUsed: number | null
  }

  export type GameScoreSumAggregateOutputType = {
    blanksScore: number | null
    contextScore: number | null
    bookScore: number | null
    referenceScore: number | null
    timeBonus: number | null
    streakBonus: number | null
    totalScore: number | null
    timeSpent: number | null
    mistakesMade: number | null
    hintsUsed: number | null
  }

  export type GameScoreMinAggregateOutputType = {
    id: string | null
    participantId: string | null
    roundId: string | null
    blanksScore: number | null
    contextScore: number | null
    bookScore: number | null
    referenceScore: number | null
    timeBonus: number | null
    streakBonus: number | null
    totalScore: number | null
    timeSpent: number | null
    mistakesMade: number | null
    hintsUsed: number | null
    createdAt: Date | null
  }

  export type GameScoreMaxAggregateOutputType = {
    id: string | null
    participantId: string | null
    roundId: string | null
    blanksScore: number | null
    contextScore: number | null
    bookScore: number | null
    referenceScore: number | null
    timeBonus: number | null
    streakBonus: number | null
    totalScore: number | null
    timeSpent: number | null
    mistakesMade: number | null
    hintsUsed: number | null
    createdAt: Date | null
  }

  export type GameScoreCountAggregateOutputType = {
    id: number
    participantId: number
    roundId: number
    blanksScore: number
    contextScore: number
    bookScore: number
    referenceScore: number
    timeBonus: number
    streakBonus: number
    totalScore: number
    timeSpent: number
    mistakesMade: number
    hintsUsed: number
    createdAt: number
    _all: number
  }


  export type GameScoreAvgAggregateInputType = {
    blanksScore?: true
    contextScore?: true
    bookScore?: true
    referenceScore?: true
    timeBonus?: true
    streakBonus?: true
    totalScore?: true
    timeSpent?: true
    mistakesMade?: true
    hintsUsed?: true
  }

  export type GameScoreSumAggregateInputType = {
    blanksScore?: true
    contextScore?: true
    bookScore?: true
    referenceScore?: true
    timeBonus?: true
    streakBonus?: true
    totalScore?: true
    timeSpent?: true
    mistakesMade?: true
    hintsUsed?: true
  }

  export type GameScoreMinAggregateInputType = {
    id?: true
    participantId?: true
    roundId?: true
    blanksScore?: true
    contextScore?: true
    bookScore?: true
    referenceScore?: true
    timeBonus?: true
    streakBonus?: true
    totalScore?: true
    timeSpent?: true
    mistakesMade?: true
    hintsUsed?: true
    createdAt?: true
  }

  export type GameScoreMaxAggregateInputType = {
    id?: true
    participantId?: true
    roundId?: true
    blanksScore?: true
    contextScore?: true
    bookScore?: true
    referenceScore?: true
    timeBonus?: true
    streakBonus?: true
    totalScore?: true
    timeSpent?: true
    mistakesMade?: true
    hintsUsed?: true
    createdAt?: true
  }

  export type GameScoreCountAggregateInputType = {
    id?: true
    participantId?: true
    roundId?: true
    blanksScore?: true
    contextScore?: true
    bookScore?: true
    referenceScore?: true
    timeBonus?: true
    streakBonus?: true
    totalScore?: true
    timeSpent?: true
    mistakesMade?: true
    hintsUsed?: true
    createdAt?: true
    _all?: true
  }

  export type GameScoreAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GameScore to aggregate.
     */
    where?: GameScoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameScores to fetch.
     */
    orderBy?: GameScoreOrderByWithRelationInput | GameScoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GameScoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameScores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameScores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GameScores
    **/
    _count?: true | GameScoreCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GameScoreAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GameScoreSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GameScoreMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GameScoreMaxAggregateInputType
  }

  export type GetGameScoreAggregateType<T extends GameScoreAggregateArgs> = {
        [P in keyof T & keyof AggregateGameScore]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGameScore[P]>
      : GetScalarType<T[P], AggregateGameScore[P]>
  }




  export type GameScoreGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GameScoreWhereInput
    orderBy?: GameScoreOrderByWithAggregationInput | GameScoreOrderByWithAggregationInput[]
    by: GameScoreScalarFieldEnum[] | GameScoreScalarFieldEnum
    having?: GameScoreScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GameScoreCountAggregateInputType | true
    _avg?: GameScoreAvgAggregateInputType
    _sum?: GameScoreSumAggregateInputType
    _min?: GameScoreMinAggregateInputType
    _max?: GameScoreMaxAggregateInputType
  }

  export type GameScoreGroupByOutputType = {
    id: string
    participantId: string
    roundId: string
    blanksScore: number
    contextScore: number
    bookScore: number
    referenceScore: number
    timeBonus: number
    streakBonus: number
    totalScore: number
    timeSpent: number
    mistakesMade: number
    hintsUsed: number
    createdAt: Date
    _count: GameScoreCountAggregateOutputType | null
    _avg: GameScoreAvgAggregateOutputType | null
    _sum: GameScoreSumAggregateOutputType | null
    _min: GameScoreMinAggregateOutputType | null
    _max: GameScoreMaxAggregateOutputType | null
  }

  type GetGameScoreGroupByPayload<T extends GameScoreGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GameScoreGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GameScoreGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GameScoreGroupByOutputType[P]>
            : GetScalarType<T[P], GameScoreGroupByOutputType[P]>
        }
      >
    >


  export type GameScoreSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    participantId?: boolean
    roundId?: boolean
    blanksScore?: boolean
    contextScore?: boolean
    bookScore?: boolean
    referenceScore?: boolean
    timeBonus?: boolean
    streakBonus?: boolean
    totalScore?: boolean
    timeSpent?: boolean
    mistakesMade?: boolean
    hintsUsed?: boolean
    createdAt?: boolean
    participant?: boolean | GameParticipantDefaultArgs<ExtArgs>
    round?: boolean | GameRoundDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gameScore"]>

  export type GameScoreSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    participantId?: boolean
    roundId?: boolean
    blanksScore?: boolean
    contextScore?: boolean
    bookScore?: boolean
    referenceScore?: boolean
    timeBonus?: boolean
    streakBonus?: boolean
    totalScore?: boolean
    timeSpent?: boolean
    mistakesMade?: boolean
    hintsUsed?: boolean
    createdAt?: boolean
    participant?: boolean | GameParticipantDefaultArgs<ExtArgs>
    round?: boolean | GameRoundDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gameScore"]>

  export type GameScoreSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    participantId?: boolean
    roundId?: boolean
    blanksScore?: boolean
    contextScore?: boolean
    bookScore?: boolean
    referenceScore?: boolean
    timeBonus?: boolean
    streakBonus?: boolean
    totalScore?: boolean
    timeSpent?: boolean
    mistakesMade?: boolean
    hintsUsed?: boolean
    createdAt?: boolean
    participant?: boolean | GameParticipantDefaultArgs<ExtArgs>
    round?: boolean | GameRoundDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["gameScore"]>

  export type GameScoreSelectScalar = {
    id?: boolean
    participantId?: boolean
    roundId?: boolean
    blanksScore?: boolean
    contextScore?: boolean
    bookScore?: boolean
    referenceScore?: boolean
    timeBonus?: boolean
    streakBonus?: boolean
    totalScore?: boolean
    timeSpent?: boolean
    mistakesMade?: boolean
    hintsUsed?: boolean
    createdAt?: boolean
  }

  export type GameScoreOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "participantId" | "roundId" | "blanksScore" | "contextScore" | "bookScore" | "referenceScore" | "timeBonus" | "streakBonus" | "totalScore" | "timeSpent" | "mistakesMade" | "hintsUsed" | "createdAt", ExtArgs["result"]["gameScore"]>
  export type GameScoreInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    participant?: boolean | GameParticipantDefaultArgs<ExtArgs>
    round?: boolean | GameRoundDefaultArgs<ExtArgs>
  }
  export type GameScoreIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    participant?: boolean | GameParticipantDefaultArgs<ExtArgs>
    round?: boolean | GameRoundDefaultArgs<ExtArgs>
  }
  export type GameScoreIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    participant?: boolean | GameParticipantDefaultArgs<ExtArgs>
    round?: boolean | GameRoundDefaultArgs<ExtArgs>
  }

  export type $GameScorePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GameScore"
    objects: {
      participant: Prisma.$GameParticipantPayload<ExtArgs>
      round: Prisma.$GameRoundPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      participantId: string
      roundId: string
      blanksScore: number
      contextScore: number
      bookScore: number
      referenceScore: number
      timeBonus: number
      streakBonus: number
      totalScore: number
      timeSpent: number
      mistakesMade: number
      hintsUsed: number
      createdAt: Date
    }, ExtArgs["result"]["gameScore"]>
    composites: {}
  }

  type GameScoreGetPayload<S extends boolean | null | undefined | GameScoreDefaultArgs> = $Result.GetResult<Prisma.$GameScorePayload, S>

  type GameScoreCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GameScoreFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GameScoreCountAggregateInputType | true
    }

  export interface GameScoreDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GameScore'], meta: { name: 'GameScore' } }
    /**
     * Find zero or one GameScore that matches the filter.
     * @param {GameScoreFindUniqueArgs} args - Arguments to find a GameScore
     * @example
     * // Get one GameScore
     * const gameScore = await prisma.gameScore.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GameScoreFindUniqueArgs>(args: SelectSubset<T, GameScoreFindUniqueArgs<ExtArgs>>): Prisma__GameScoreClient<$Result.GetResult<Prisma.$GameScorePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GameScore that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GameScoreFindUniqueOrThrowArgs} args - Arguments to find a GameScore
     * @example
     * // Get one GameScore
     * const gameScore = await prisma.gameScore.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GameScoreFindUniqueOrThrowArgs>(args: SelectSubset<T, GameScoreFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GameScoreClient<$Result.GetResult<Prisma.$GameScorePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GameScore that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameScoreFindFirstArgs} args - Arguments to find a GameScore
     * @example
     * // Get one GameScore
     * const gameScore = await prisma.gameScore.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GameScoreFindFirstArgs>(args?: SelectSubset<T, GameScoreFindFirstArgs<ExtArgs>>): Prisma__GameScoreClient<$Result.GetResult<Prisma.$GameScorePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GameScore that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameScoreFindFirstOrThrowArgs} args - Arguments to find a GameScore
     * @example
     * // Get one GameScore
     * const gameScore = await prisma.gameScore.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GameScoreFindFirstOrThrowArgs>(args?: SelectSubset<T, GameScoreFindFirstOrThrowArgs<ExtArgs>>): Prisma__GameScoreClient<$Result.GetResult<Prisma.$GameScorePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GameScores that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameScoreFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GameScores
     * const gameScores = await prisma.gameScore.findMany()
     * 
     * // Get first 10 GameScores
     * const gameScores = await prisma.gameScore.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const gameScoreWithIdOnly = await prisma.gameScore.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GameScoreFindManyArgs>(args?: SelectSubset<T, GameScoreFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameScorePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GameScore.
     * @param {GameScoreCreateArgs} args - Arguments to create a GameScore.
     * @example
     * // Create one GameScore
     * const GameScore = await prisma.gameScore.create({
     *   data: {
     *     // ... data to create a GameScore
     *   }
     * })
     * 
     */
    create<T extends GameScoreCreateArgs>(args: SelectSubset<T, GameScoreCreateArgs<ExtArgs>>): Prisma__GameScoreClient<$Result.GetResult<Prisma.$GameScorePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GameScores.
     * @param {GameScoreCreateManyArgs} args - Arguments to create many GameScores.
     * @example
     * // Create many GameScores
     * const gameScore = await prisma.gameScore.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GameScoreCreateManyArgs>(args?: SelectSubset<T, GameScoreCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GameScores and returns the data saved in the database.
     * @param {GameScoreCreateManyAndReturnArgs} args - Arguments to create many GameScores.
     * @example
     * // Create many GameScores
     * const gameScore = await prisma.gameScore.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GameScores and only return the `id`
     * const gameScoreWithIdOnly = await prisma.gameScore.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GameScoreCreateManyAndReturnArgs>(args?: SelectSubset<T, GameScoreCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameScorePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a GameScore.
     * @param {GameScoreDeleteArgs} args - Arguments to delete one GameScore.
     * @example
     * // Delete one GameScore
     * const GameScore = await prisma.gameScore.delete({
     *   where: {
     *     // ... filter to delete one GameScore
     *   }
     * })
     * 
     */
    delete<T extends GameScoreDeleteArgs>(args: SelectSubset<T, GameScoreDeleteArgs<ExtArgs>>): Prisma__GameScoreClient<$Result.GetResult<Prisma.$GameScorePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GameScore.
     * @param {GameScoreUpdateArgs} args - Arguments to update one GameScore.
     * @example
     * // Update one GameScore
     * const gameScore = await prisma.gameScore.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GameScoreUpdateArgs>(args: SelectSubset<T, GameScoreUpdateArgs<ExtArgs>>): Prisma__GameScoreClient<$Result.GetResult<Prisma.$GameScorePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GameScores.
     * @param {GameScoreDeleteManyArgs} args - Arguments to filter GameScores to delete.
     * @example
     * // Delete a few GameScores
     * const { count } = await prisma.gameScore.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GameScoreDeleteManyArgs>(args?: SelectSubset<T, GameScoreDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GameScores.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameScoreUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GameScores
     * const gameScore = await prisma.gameScore.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GameScoreUpdateManyArgs>(args: SelectSubset<T, GameScoreUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GameScores and returns the data updated in the database.
     * @param {GameScoreUpdateManyAndReturnArgs} args - Arguments to update many GameScores.
     * @example
     * // Update many GameScores
     * const gameScore = await prisma.gameScore.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more GameScores and only return the `id`
     * const gameScoreWithIdOnly = await prisma.gameScore.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GameScoreUpdateManyAndReturnArgs>(args: SelectSubset<T, GameScoreUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GameScorePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one GameScore.
     * @param {GameScoreUpsertArgs} args - Arguments to update or create a GameScore.
     * @example
     * // Update or create a GameScore
     * const gameScore = await prisma.gameScore.upsert({
     *   create: {
     *     // ... data to create a GameScore
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GameScore we want to update
     *   }
     * })
     */
    upsert<T extends GameScoreUpsertArgs>(args: SelectSubset<T, GameScoreUpsertArgs<ExtArgs>>): Prisma__GameScoreClient<$Result.GetResult<Prisma.$GameScorePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GameScores.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameScoreCountArgs} args - Arguments to filter GameScores to count.
     * @example
     * // Count the number of GameScores
     * const count = await prisma.gameScore.count({
     *   where: {
     *     // ... the filter for the GameScores we want to count
     *   }
     * })
    **/
    count<T extends GameScoreCountArgs>(
      args?: Subset<T, GameScoreCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GameScoreCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GameScore.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameScoreAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GameScoreAggregateArgs>(args: Subset<T, GameScoreAggregateArgs>): Prisma.PrismaPromise<GetGameScoreAggregateType<T>>

    /**
     * Group by GameScore.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GameScoreGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GameScoreGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GameScoreGroupByArgs['orderBy'] }
        : { orderBy?: GameScoreGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GameScoreGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGameScoreGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GameScore model
   */
  readonly fields: GameScoreFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GameScore.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GameScoreClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    participant<T extends GameParticipantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, GameParticipantDefaultArgs<ExtArgs>>): Prisma__GameParticipantClient<$Result.GetResult<Prisma.$GameParticipantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    round<T extends GameRoundDefaultArgs<ExtArgs> = {}>(args?: Subset<T, GameRoundDefaultArgs<ExtArgs>>): Prisma__GameRoundClient<$Result.GetResult<Prisma.$GameRoundPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GameScore model
   */
  interface GameScoreFieldRefs {
    readonly id: FieldRef<"GameScore", 'String'>
    readonly participantId: FieldRef<"GameScore", 'String'>
    readonly roundId: FieldRef<"GameScore", 'String'>
    readonly blanksScore: FieldRef<"GameScore", 'Int'>
    readonly contextScore: FieldRef<"GameScore", 'Int'>
    readonly bookScore: FieldRef<"GameScore", 'Int'>
    readonly referenceScore: FieldRef<"GameScore", 'Int'>
    readonly timeBonus: FieldRef<"GameScore", 'Int'>
    readonly streakBonus: FieldRef<"GameScore", 'Int'>
    readonly totalScore: FieldRef<"GameScore", 'Int'>
    readonly timeSpent: FieldRef<"GameScore", 'Int'>
    readonly mistakesMade: FieldRef<"GameScore", 'Int'>
    readonly hintsUsed: FieldRef<"GameScore", 'Int'>
    readonly createdAt: FieldRef<"GameScore", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GameScore findUnique
   */
  export type GameScoreFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameScore
     */
    select?: GameScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameScore
     */
    omit?: GameScoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameScoreInclude<ExtArgs> | null
    /**
     * Filter, which GameScore to fetch.
     */
    where: GameScoreWhereUniqueInput
  }

  /**
   * GameScore findUniqueOrThrow
   */
  export type GameScoreFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameScore
     */
    select?: GameScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameScore
     */
    omit?: GameScoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameScoreInclude<ExtArgs> | null
    /**
     * Filter, which GameScore to fetch.
     */
    where: GameScoreWhereUniqueInput
  }

  /**
   * GameScore findFirst
   */
  export type GameScoreFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameScore
     */
    select?: GameScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameScore
     */
    omit?: GameScoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameScoreInclude<ExtArgs> | null
    /**
     * Filter, which GameScore to fetch.
     */
    where?: GameScoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameScores to fetch.
     */
    orderBy?: GameScoreOrderByWithRelationInput | GameScoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GameScores.
     */
    cursor?: GameScoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameScores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameScores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GameScores.
     */
    distinct?: GameScoreScalarFieldEnum | GameScoreScalarFieldEnum[]
  }

  /**
   * GameScore findFirstOrThrow
   */
  export type GameScoreFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameScore
     */
    select?: GameScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameScore
     */
    omit?: GameScoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameScoreInclude<ExtArgs> | null
    /**
     * Filter, which GameScore to fetch.
     */
    where?: GameScoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameScores to fetch.
     */
    orderBy?: GameScoreOrderByWithRelationInput | GameScoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GameScores.
     */
    cursor?: GameScoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameScores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameScores.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GameScores.
     */
    distinct?: GameScoreScalarFieldEnum | GameScoreScalarFieldEnum[]
  }

  /**
   * GameScore findMany
   */
  export type GameScoreFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameScore
     */
    select?: GameScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameScore
     */
    omit?: GameScoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameScoreInclude<ExtArgs> | null
    /**
     * Filter, which GameScores to fetch.
     */
    where?: GameScoreWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GameScores to fetch.
     */
    orderBy?: GameScoreOrderByWithRelationInput | GameScoreOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GameScores.
     */
    cursor?: GameScoreWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GameScores from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GameScores.
     */
    skip?: number
    distinct?: GameScoreScalarFieldEnum | GameScoreScalarFieldEnum[]
  }

  /**
   * GameScore create
   */
  export type GameScoreCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameScore
     */
    select?: GameScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameScore
     */
    omit?: GameScoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameScoreInclude<ExtArgs> | null
    /**
     * The data needed to create a GameScore.
     */
    data: XOR<GameScoreCreateInput, GameScoreUncheckedCreateInput>
  }

  /**
   * GameScore createMany
   */
  export type GameScoreCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GameScores.
     */
    data: GameScoreCreateManyInput | GameScoreCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * GameScore createManyAndReturn
   */
  export type GameScoreCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameScore
     */
    select?: GameScoreSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GameScore
     */
    omit?: GameScoreOmit<ExtArgs> | null
    /**
     * The data used to create many GameScores.
     */
    data: GameScoreCreateManyInput | GameScoreCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameScoreIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * GameScore update
   */
  export type GameScoreUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameScore
     */
    select?: GameScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameScore
     */
    omit?: GameScoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameScoreInclude<ExtArgs> | null
    /**
     * The data needed to update a GameScore.
     */
    data: XOR<GameScoreUpdateInput, GameScoreUncheckedUpdateInput>
    /**
     * Choose, which GameScore to update.
     */
    where: GameScoreWhereUniqueInput
  }

  /**
   * GameScore updateMany
   */
  export type GameScoreUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GameScores.
     */
    data: XOR<GameScoreUpdateManyMutationInput, GameScoreUncheckedUpdateManyInput>
    /**
     * Filter which GameScores to update
     */
    where?: GameScoreWhereInput
    /**
     * Limit how many GameScores to update.
     */
    limit?: number
  }

  /**
   * GameScore updateManyAndReturn
   */
  export type GameScoreUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameScore
     */
    select?: GameScoreSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GameScore
     */
    omit?: GameScoreOmit<ExtArgs> | null
    /**
     * The data used to update GameScores.
     */
    data: XOR<GameScoreUpdateManyMutationInput, GameScoreUncheckedUpdateManyInput>
    /**
     * Filter which GameScores to update
     */
    where?: GameScoreWhereInput
    /**
     * Limit how many GameScores to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameScoreIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * GameScore upsert
   */
  export type GameScoreUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameScore
     */
    select?: GameScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameScore
     */
    omit?: GameScoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameScoreInclude<ExtArgs> | null
    /**
     * The filter to search for the GameScore to update in case it exists.
     */
    where: GameScoreWhereUniqueInput
    /**
     * In case the GameScore found by the `where` argument doesn't exist, create a new GameScore with this data.
     */
    create: XOR<GameScoreCreateInput, GameScoreUncheckedCreateInput>
    /**
     * In case the GameScore was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GameScoreUpdateInput, GameScoreUncheckedUpdateInput>
  }

  /**
   * GameScore delete
   */
  export type GameScoreDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameScore
     */
    select?: GameScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameScore
     */
    omit?: GameScoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameScoreInclude<ExtArgs> | null
    /**
     * Filter which GameScore to delete.
     */
    where: GameScoreWhereUniqueInput
  }

  /**
   * GameScore deleteMany
   */
  export type GameScoreDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GameScores to delete
     */
    where?: GameScoreWhereInput
    /**
     * Limit how many GameScores to delete.
     */
    limit?: number
  }

  /**
   * GameScore without action
   */
  export type GameScoreDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GameScore
     */
    select?: GameScoreSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GameScore
     */
    omit?: GameScoreOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GameScoreInclude<ExtArgs> | null
  }


  /**
   * Model DailyChallenge
   */

  export type AggregateDailyChallenge = {
    _count: DailyChallengeCountAggregateOutputType | null
    _avg: DailyChallengeAvgAggregateOutputType | null
    _sum: DailyChallengeSumAggregateOutputType | null
    _min: DailyChallengeMinAggregateOutputType | null
    _max: DailyChallengeMaxAggregateOutputType | null
  }

  export type DailyChallengeAvgAggregateOutputType = {
    maxAttempts: number | null
    timeLimit: number | null
  }

  export type DailyChallengeSumAggregateOutputType = {
    maxAttempts: number | null
    timeLimit: number | null
  }

  export type DailyChallengeMinAggregateOutputType = {
    id: string | null
    date: Date | null
    verse: string | null
    correctBook: string | null
    correctRef: string | null
    context: string | null
    difficulty: string | null
    maxAttempts: number | null
    timeLimit: number | null
    isActive: boolean | null
    createdAt: Date | null
  }

  export type DailyChallengeMaxAggregateOutputType = {
    id: string | null
    date: Date | null
    verse: string | null
    correctBook: string | null
    correctRef: string | null
    context: string | null
    difficulty: string | null
    maxAttempts: number | null
    timeLimit: number | null
    isActive: boolean | null
    createdAt: Date | null
  }

  export type DailyChallengeCountAggregateOutputType = {
    id: number
    date: number
    verse: number
    blanks: number
    emojiMapping: number
    correctBook: number
    correctRef: number
    context: number
    difficulty: number
    maxAttempts: number
    timeLimit: number
    isActive: number
    createdAt: number
    _all: number
  }


  export type DailyChallengeAvgAggregateInputType = {
    maxAttempts?: true
    timeLimit?: true
  }

  export type DailyChallengeSumAggregateInputType = {
    maxAttempts?: true
    timeLimit?: true
  }

  export type DailyChallengeMinAggregateInputType = {
    id?: true
    date?: true
    verse?: true
    correctBook?: true
    correctRef?: true
    context?: true
    difficulty?: true
    maxAttempts?: true
    timeLimit?: true
    isActive?: true
    createdAt?: true
  }

  export type DailyChallengeMaxAggregateInputType = {
    id?: true
    date?: true
    verse?: true
    correctBook?: true
    correctRef?: true
    context?: true
    difficulty?: true
    maxAttempts?: true
    timeLimit?: true
    isActive?: true
    createdAt?: true
  }

  export type DailyChallengeCountAggregateInputType = {
    id?: true
    date?: true
    verse?: true
    blanks?: true
    emojiMapping?: true
    correctBook?: true
    correctRef?: true
    context?: true
    difficulty?: true
    maxAttempts?: true
    timeLimit?: true
    isActive?: true
    createdAt?: true
    _all?: true
  }

  export type DailyChallengeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DailyChallenge to aggregate.
     */
    where?: DailyChallengeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DailyChallenges to fetch.
     */
    orderBy?: DailyChallengeOrderByWithRelationInput | DailyChallengeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DailyChallengeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DailyChallenges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DailyChallenges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DailyChallenges
    **/
    _count?: true | DailyChallengeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DailyChallengeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DailyChallengeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DailyChallengeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DailyChallengeMaxAggregateInputType
  }

  export type GetDailyChallengeAggregateType<T extends DailyChallengeAggregateArgs> = {
        [P in keyof T & keyof AggregateDailyChallenge]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDailyChallenge[P]>
      : GetScalarType<T[P], AggregateDailyChallenge[P]>
  }




  export type DailyChallengeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DailyChallengeWhereInput
    orderBy?: DailyChallengeOrderByWithAggregationInput | DailyChallengeOrderByWithAggregationInput[]
    by: DailyChallengeScalarFieldEnum[] | DailyChallengeScalarFieldEnum
    having?: DailyChallengeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DailyChallengeCountAggregateInputType | true
    _avg?: DailyChallengeAvgAggregateInputType
    _sum?: DailyChallengeSumAggregateInputType
    _min?: DailyChallengeMinAggregateInputType
    _max?: DailyChallengeMaxAggregateInputType
  }

  export type DailyChallengeGroupByOutputType = {
    id: string
    date: Date
    verse: string
    blanks: JsonValue
    emojiMapping: JsonValue
    correctBook: string
    correctRef: string
    context: string | null
    difficulty: string
    maxAttempts: number
    timeLimit: number | null
    isActive: boolean
    createdAt: Date
    _count: DailyChallengeCountAggregateOutputType | null
    _avg: DailyChallengeAvgAggregateOutputType | null
    _sum: DailyChallengeSumAggregateOutputType | null
    _min: DailyChallengeMinAggregateOutputType | null
    _max: DailyChallengeMaxAggregateOutputType | null
  }

  type GetDailyChallengeGroupByPayload<T extends DailyChallengeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DailyChallengeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DailyChallengeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DailyChallengeGroupByOutputType[P]>
            : GetScalarType<T[P], DailyChallengeGroupByOutputType[P]>
        }
      >
    >


  export type DailyChallengeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    date?: boolean
    verse?: boolean
    blanks?: boolean
    emojiMapping?: boolean
    correctBook?: boolean
    correctRef?: boolean
    context?: boolean
    difficulty?: boolean
    maxAttempts?: boolean
    timeLimit?: boolean
    isActive?: boolean
    createdAt?: boolean
    answers?: boolean | DailyChallenge$answersArgs<ExtArgs>
    _count?: boolean | DailyChallengeCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dailyChallenge"]>

  export type DailyChallengeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    date?: boolean
    verse?: boolean
    blanks?: boolean
    emojiMapping?: boolean
    correctBook?: boolean
    correctRef?: boolean
    context?: boolean
    difficulty?: boolean
    maxAttempts?: boolean
    timeLimit?: boolean
    isActive?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["dailyChallenge"]>

  export type DailyChallengeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    date?: boolean
    verse?: boolean
    blanks?: boolean
    emojiMapping?: boolean
    correctBook?: boolean
    correctRef?: boolean
    context?: boolean
    difficulty?: boolean
    maxAttempts?: boolean
    timeLimit?: boolean
    isActive?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["dailyChallenge"]>

  export type DailyChallengeSelectScalar = {
    id?: boolean
    date?: boolean
    verse?: boolean
    blanks?: boolean
    emojiMapping?: boolean
    correctBook?: boolean
    correctRef?: boolean
    context?: boolean
    difficulty?: boolean
    maxAttempts?: boolean
    timeLimit?: boolean
    isActive?: boolean
    createdAt?: boolean
  }

  export type DailyChallengeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "date" | "verse" | "blanks" | "emojiMapping" | "correctBook" | "correctRef" | "context" | "difficulty" | "maxAttempts" | "timeLimit" | "isActive" | "createdAt", ExtArgs["result"]["dailyChallenge"]>
  export type DailyChallengeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    answers?: boolean | DailyChallenge$answersArgs<ExtArgs>
    _count?: boolean | DailyChallengeCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DailyChallengeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type DailyChallengeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $DailyChallengePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DailyChallenge"
    objects: {
      answers: Prisma.$DailyChallengeAnswerPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      date: Date
      verse: string
      blanks: Prisma.JsonValue
      emojiMapping: Prisma.JsonValue
      correctBook: string
      correctRef: string
      context: string | null
      difficulty: string
      maxAttempts: number
      timeLimit: number | null
      isActive: boolean
      createdAt: Date
    }, ExtArgs["result"]["dailyChallenge"]>
    composites: {}
  }

  type DailyChallengeGetPayload<S extends boolean | null | undefined | DailyChallengeDefaultArgs> = $Result.GetResult<Prisma.$DailyChallengePayload, S>

  type DailyChallengeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DailyChallengeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DailyChallengeCountAggregateInputType | true
    }

  export interface DailyChallengeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DailyChallenge'], meta: { name: 'DailyChallenge' } }
    /**
     * Find zero or one DailyChallenge that matches the filter.
     * @param {DailyChallengeFindUniqueArgs} args - Arguments to find a DailyChallenge
     * @example
     * // Get one DailyChallenge
     * const dailyChallenge = await prisma.dailyChallenge.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DailyChallengeFindUniqueArgs>(args: SelectSubset<T, DailyChallengeFindUniqueArgs<ExtArgs>>): Prisma__DailyChallengeClient<$Result.GetResult<Prisma.$DailyChallengePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DailyChallenge that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DailyChallengeFindUniqueOrThrowArgs} args - Arguments to find a DailyChallenge
     * @example
     * // Get one DailyChallenge
     * const dailyChallenge = await prisma.dailyChallenge.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DailyChallengeFindUniqueOrThrowArgs>(args: SelectSubset<T, DailyChallengeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DailyChallengeClient<$Result.GetResult<Prisma.$DailyChallengePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DailyChallenge that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyChallengeFindFirstArgs} args - Arguments to find a DailyChallenge
     * @example
     * // Get one DailyChallenge
     * const dailyChallenge = await prisma.dailyChallenge.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DailyChallengeFindFirstArgs>(args?: SelectSubset<T, DailyChallengeFindFirstArgs<ExtArgs>>): Prisma__DailyChallengeClient<$Result.GetResult<Prisma.$DailyChallengePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DailyChallenge that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyChallengeFindFirstOrThrowArgs} args - Arguments to find a DailyChallenge
     * @example
     * // Get one DailyChallenge
     * const dailyChallenge = await prisma.dailyChallenge.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DailyChallengeFindFirstOrThrowArgs>(args?: SelectSubset<T, DailyChallengeFindFirstOrThrowArgs<ExtArgs>>): Prisma__DailyChallengeClient<$Result.GetResult<Prisma.$DailyChallengePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DailyChallenges that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyChallengeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DailyChallenges
     * const dailyChallenges = await prisma.dailyChallenge.findMany()
     * 
     * // Get first 10 DailyChallenges
     * const dailyChallenges = await prisma.dailyChallenge.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const dailyChallengeWithIdOnly = await prisma.dailyChallenge.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DailyChallengeFindManyArgs>(args?: SelectSubset<T, DailyChallengeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DailyChallengePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DailyChallenge.
     * @param {DailyChallengeCreateArgs} args - Arguments to create a DailyChallenge.
     * @example
     * // Create one DailyChallenge
     * const DailyChallenge = await prisma.dailyChallenge.create({
     *   data: {
     *     // ... data to create a DailyChallenge
     *   }
     * })
     * 
     */
    create<T extends DailyChallengeCreateArgs>(args: SelectSubset<T, DailyChallengeCreateArgs<ExtArgs>>): Prisma__DailyChallengeClient<$Result.GetResult<Prisma.$DailyChallengePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DailyChallenges.
     * @param {DailyChallengeCreateManyArgs} args - Arguments to create many DailyChallenges.
     * @example
     * // Create many DailyChallenges
     * const dailyChallenge = await prisma.dailyChallenge.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DailyChallengeCreateManyArgs>(args?: SelectSubset<T, DailyChallengeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DailyChallenges and returns the data saved in the database.
     * @param {DailyChallengeCreateManyAndReturnArgs} args - Arguments to create many DailyChallenges.
     * @example
     * // Create many DailyChallenges
     * const dailyChallenge = await prisma.dailyChallenge.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DailyChallenges and only return the `id`
     * const dailyChallengeWithIdOnly = await prisma.dailyChallenge.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DailyChallengeCreateManyAndReturnArgs>(args?: SelectSubset<T, DailyChallengeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DailyChallengePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DailyChallenge.
     * @param {DailyChallengeDeleteArgs} args - Arguments to delete one DailyChallenge.
     * @example
     * // Delete one DailyChallenge
     * const DailyChallenge = await prisma.dailyChallenge.delete({
     *   where: {
     *     // ... filter to delete one DailyChallenge
     *   }
     * })
     * 
     */
    delete<T extends DailyChallengeDeleteArgs>(args: SelectSubset<T, DailyChallengeDeleteArgs<ExtArgs>>): Prisma__DailyChallengeClient<$Result.GetResult<Prisma.$DailyChallengePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DailyChallenge.
     * @param {DailyChallengeUpdateArgs} args - Arguments to update one DailyChallenge.
     * @example
     * // Update one DailyChallenge
     * const dailyChallenge = await prisma.dailyChallenge.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DailyChallengeUpdateArgs>(args: SelectSubset<T, DailyChallengeUpdateArgs<ExtArgs>>): Prisma__DailyChallengeClient<$Result.GetResult<Prisma.$DailyChallengePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DailyChallenges.
     * @param {DailyChallengeDeleteManyArgs} args - Arguments to filter DailyChallenges to delete.
     * @example
     * // Delete a few DailyChallenges
     * const { count } = await prisma.dailyChallenge.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DailyChallengeDeleteManyArgs>(args?: SelectSubset<T, DailyChallengeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DailyChallenges.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyChallengeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DailyChallenges
     * const dailyChallenge = await prisma.dailyChallenge.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DailyChallengeUpdateManyArgs>(args: SelectSubset<T, DailyChallengeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DailyChallenges and returns the data updated in the database.
     * @param {DailyChallengeUpdateManyAndReturnArgs} args - Arguments to update many DailyChallenges.
     * @example
     * // Update many DailyChallenges
     * const dailyChallenge = await prisma.dailyChallenge.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DailyChallenges and only return the `id`
     * const dailyChallengeWithIdOnly = await prisma.dailyChallenge.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DailyChallengeUpdateManyAndReturnArgs>(args: SelectSubset<T, DailyChallengeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DailyChallengePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DailyChallenge.
     * @param {DailyChallengeUpsertArgs} args - Arguments to update or create a DailyChallenge.
     * @example
     * // Update or create a DailyChallenge
     * const dailyChallenge = await prisma.dailyChallenge.upsert({
     *   create: {
     *     // ... data to create a DailyChallenge
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DailyChallenge we want to update
     *   }
     * })
     */
    upsert<T extends DailyChallengeUpsertArgs>(args: SelectSubset<T, DailyChallengeUpsertArgs<ExtArgs>>): Prisma__DailyChallengeClient<$Result.GetResult<Prisma.$DailyChallengePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DailyChallenges.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyChallengeCountArgs} args - Arguments to filter DailyChallenges to count.
     * @example
     * // Count the number of DailyChallenges
     * const count = await prisma.dailyChallenge.count({
     *   where: {
     *     // ... the filter for the DailyChallenges we want to count
     *   }
     * })
    **/
    count<T extends DailyChallengeCountArgs>(
      args?: Subset<T, DailyChallengeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DailyChallengeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DailyChallenge.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyChallengeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DailyChallengeAggregateArgs>(args: Subset<T, DailyChallengeAggregateArgs>): Prisma.PrismaPromise<GetDailyChallengeAggregateType<T>>

    /**
     * Group by DailyChallenge.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyChallengeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DailyChallengeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DailyChallengeGroupByArgs['orderBy'] }
        : { orderBy?: DailyChallengeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DailyChallengeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDailyChallengeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DailyChallenge model
   */
  readonly fields: DailyChallengeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DailyChallenge.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DailyChallengeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    answers<T extends DailyChallenge$answersArgs<ExtArgs> = {}>(args?: Subset<T, DailyChallenge$answersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DailyChallengeAnswerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DailyChallenge model
   */
  interface DailyChallengeFieldRefs {
    readonly id: FieldRef<"DailyChallenge", 'String'>
    readonly date: FieldRef<"DailyChallenge", 'DateTime'>
    readonly verse: FieldRef<"DailyChallenge", 'String'>
    readonly blanks: FieldRef<"DailyChallenge", 'Json'>
    readonly emojiMapping: FieldRef<"DailyChallenge", 'Json'>
    readonly correctBook: FieldRef<"DailyChallenge", 'String'>
    readonly correctRef: FieldRef<"DailyChallenge", 'String'>
    readonly context: FieldRef<"DailyChallenge", 'String'>
    readonly difficulty: FieldRef<"DailyChallenge", 'String'>
    readonly maxAttempts: FieldRef<"DailyChallenge", 'Int'>
    readonly timeLimit: FieldRef<"DailyChallenge", 'Int'>
    readonly isActive: FieldRef<"DailyChallenge", 'Boolean'>
    readonly createdAt: FieldRef<"DailyChallenge", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DailyChallenge findUnique
   */
  export type DailyChallengeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyChallenge
     */
    select?: DailyChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyChallenge
     */
    omit?: DailyChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyChallengeInclude<ExtArgs> | null
    /**
     * Filter, which DailyChallenge to fetch.
     */
    where: DailyChallengeWhereUniqueInput
  }

  /**
   * DailyChallenge findUniqueOrThrow
   */
  export type DailyChallengeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyChallenge
     */
    select?: DailyChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyChallenge
     */
    omit?: DailyChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyChallengeInclude<ExtArgs> | null
    /**
     * Filter, which DailyChallenge to fetch.
     */
    where: DailyChallengeWhereUniqueInput
  }

  /**
   * DailyChallenge findFirst
   */
  export type DailyChallengeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyChallenge
     */
    select?: DailyChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyChallenge
     */
    omit?: DailyChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyChallengeInclude<ExtArgs> | null
    /**
     * Filter, which DailyChallenge to fetch.
     */
    where?: DailyChallengeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DailyChallenges to fetch.
     */
    orderBy?: DailyChallengeOrderByWithRelationInput | DailyChallengeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DailyChallenges.
     */
    cursor?: DailyChallengeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DailyChallenges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DailyChallenges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DailyChallenges.
     */
    distinct?: DailyChallengeScalarFieldEnum | DailyChallengeScalarFieldEnum[]
  }

  /**
   * DailyChallenge findFirstOrThrow
   */
  export type DailyChallengeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyChallenge
     */
    select?: DailyChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyChallenge
     */
    omit?: DailyChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyChallengeInclude<ExtArgs> | null
    /**
     * Filter, which DailyChallenge to fetch.
     */
    where?: DailyChallengeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DailyChallenges to fetch.
     */
    orderBy?: DailyChallengeOrderByWithRelationInput | DailyChallengeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DailyChallenges.
     */
    cursor?: DailyChallengeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DailyChallenges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DailyChallenges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DailyChallenges.
     */
    distinct?: DailyChallengeScalarFieldEnum | DailyChallengeScalarFieldEnum[]
  }

  /**
   * DailyChallenge findMany
   */
  export type DailyChallengeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyChallenge
     */
    select?: DailyChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyChallenge
     */
    omit?: DailyChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyChallengeInclude<ExtArgs> | null
    /**
     * Filter, which DailyChallenges to fetch.
     */
    where?: DailyChallengeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DailyChallenges to fetch.
     */
    orderBy?: DailyChallengeOrderByWithRelationInput | DailyChallengeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DailyChallenges.
     */
    cursor?: DailyChallengeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DailyChallenges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DailyChallenges.
     */
    skip?: number
    distinct?: DailyChallengeScalarFieldEnum | DailyChallengeScalarFieldEnum[]
  }

  /**
   * DailyChallenge create
   */
  export type DailyChallengeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyChallenge
     */
    select?: DailyChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyChallenge
     */
    omit?: DailyChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyChallengeInclude<ExtArgs> | null
    /**
     * The data needed to create a DailyChallenge.
     */
    data: XOR<DailyChallengeCreateInput, DailyChallengeUncheckedCreateInput>
  }

  /**
   * DailyChallenge createMany
   */
  export type DailyChallengeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DailyChallenges.
     */
    data: DailyChallengeCreateManyInput | DailyChallengeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DailyChallenge createManyAndReturn
   */
  export type DailyChallengeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyChallenge
     */
    select?: DailyChallengeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DailyChallenge
     */
    omit?: DailyChallengeOmit<ExtArgs> | null
    /**
     * The data used to create many DailyChallenges.
     */
    data: DailyChallengeCreateManyInput | DailyChallengeCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DailyChallenge update
   */
  export type DailyChallengeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyChallenge
     */
    select?: DailyChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyChallenge
     */
    omit?: DailyChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyChallengeInclude<ExtArgs> | null
    /**
     * The data needed to update a DailyChallenge.
     */
    data: XOR<DailyChallengeUpdateInput, DailyChallengeUncheckedUpdateInput>
    /**
     * Choose, which DailyChallenge to update.
     */
    where: DailyChallengeWhereUniqueInput
  }

  /**
   * DailyChallenge updateMany
   */
  export type DailyChallengeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DailyChallenges.
     */
    data: XOR<DailyChallengeUpdateManyMutationInput, DailyChallengeUncheckedUpdateManyInput>
    /**
     * Filter which DailyChallenges to update
     */
    where?: DailyChallengeWhereInput
    /**
     * Limit how many DailyChallenges to update.
     */
    limit?: number
  }

  /**
   * DailyChallenge updateManyAndReturn
   */
  export type DailyChallengeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyChallenge
     */
    select?: DailyChallengeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DailyChallenge
     */
    omit?: DailyChallengeOmit<ExtArgs> | null
    /**
     * The data used to update DailyChallenges.
     */
    data: XOR<DailyChallengeUpdateManyMutationInput, DailyChallengeUncheckedUpdateManyInput>
    /**
     * Filter which DailyChallenges to update
     */
    where?: DailyChallengeWhereInput
    /**
     * Limit how many DailyChallenges to update.
     */
    limit?: number
  }

  /**
   * DailyChallenge upsert
   */
  export type DailyChallengeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyChallenge
     */
    select?: DailyChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyChallenge
     */
    omit?: DailyChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyChallengeInclude<ExtArgs> | null
    /**
     * The filter to search for the DailyChallenge to update in case it exists.
     */
    where: DailyChallengeWhereUniqueInput
    /**
     * In case the DailyChallenge found by the `where` argument doesn't exist, create a new DailyChallenge with this data.
     */
    create: XOR<DailyChallengeCreateInput, DailyChallengeUncheckedCreateInput>
    /**
     * In case the DailyChallenge was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DailyChallengeUpdateInput, DailyChallengeUncheckedUpdateInput>
  }

  /**
   * DailyChallenge delete
   */
  export type DailyChallengeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyChallenge
     */
    select?: DailyChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyChallenge
     */
    omit?: DailyChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyChallengeInclude<ExtArgs> | null
    /**
     * Filter which DailyChallenge to delete.
     */
    where: DailyChallengeWhereUniqueInput
  }

  /**
   * DailyChallenge deleteMany
   */
  export type DailyChallengeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DailyChallenges to delete
     */
    where?: DailyChallengeWhereInput
    /**
     * Limit how many DailyChallenges to delete.
     */
    limit?: number
  }

  /**
   * DailyChallenge.answers
   */
  export type DailyChallenge$answersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyChallengeAnswer
     */
    select?: DailyChallengeAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyChallengeAnswer
     */
    omit?: DailyChallengeAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyChallengeAnswerInclude<ExtArgs> | null
    where?: DailyChallengeAnswerWhereInput
    orderBy?: DailyChallengeAnswerOrderByWithRelationInput | DailyChallengeAnswerOrderByWithRelationInput[]
    cursor?: DailyChallengeAnswerWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DailyChallengeAnswerScalarFieldEnum | DailyChallengeAnswerScalarFieldEnum[]
  }

  /**
   * DailyChallenge without action
   */
  export type DailyChallengeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyChallenge
     */
    select?: DailyChallengeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyChallenge
     */
    omit?: DailyChallengeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyChallengeInclude<ExtArgs> | null
  }


  /**
   * Model DailyChallengeAnswer
   */

  export type AggregateDailyChallengeAnswer = {
    _count: DailyChallengeAnswerCountAggregateOutputType | null
    _avg: DailyChallengeAnswerAvgAggregateOutputType | null
    _sum: DailyChallengeAnswerSumAggregateOutputType | null
    _min: DailyChallengeAnswerMinAggregateOutputType | null
    _max: DailyChallengeAnswerMaxAggregateOutputType | null
  }

  export type DailyChallengeAnswerAvgAggregateOutputType = {
    score: number | null
    timeSpent: number | null
    hintsUsed: number | null
  }

  export type DailyChallengeAnswerSumAggregateOutputType = {
    score: number | null
    timeSpent: number | null
    hintsUsed: number | null
  }

  export type DailyChallengeAnswerMinAggregateOutputType = {
    id: string | null
    challengeId: string | null
    userId: string | null
    isCorrect: boolean | null
    score: number | null
    timeSpent: number | null
    hintsUsed: number | null
    completedAt: Date | null
  }

  export type DailyChallengeAnswerMaxAggregateOutputType = {
    id: string | null
    challengeId: string | null
    userId: string | null
    isCorrect: boolean | null
    score: number | null
    timeSpent: number | null
    hintsUsed: number | null
    completedAt: Date | null
  }

  export type DailyChallengeAnswerCountAggregateOutputType = {
    id: number
    challengeId: number
    userId: number
    userAnswers: number
    isCorrect: number
    score: number
    timeSpent: number
    hintsUsed: number
    completedAt: number
    _all: number
  }


  export type DailyChallengeAnswerAvgAggregateInputType = {
    score?: true
    timeSpent?: true
    hintsUsed?: true
  }

  export type DailyChallengeAnswerSumAggregateInputType = {
    score?: true
    timeSpent?: true
    hintsUsed?: true
  }

  export type DailyChallengeAnswerMinAggregateInputType = {
    id?: true
    challengeId?: true
    userId?: true
    isCorrect?: true
    score?: true
    timeSpent?: true
    hintsUsed?: true
    completedAt?: true
  }

  export type DailyChallengeAnswerMaxAggregateInputType = {
    id?: true
    challengeId?: true
    userId?: true
    isCorrect?: true
    score?: true
    timeSpent?: true
    hintsUsed?: true
    completedAt?: true
  }

  export type DailyChallengeAnswerCountAggregateInputType = {
    id?: true
    challengeId?: true
    userId?: true
    userAnswers?: true
    isCorrect?: true
    score?: true
    timeSpent?: true
    hintsUsed?: true
    completedAt?: true
    _all?: true
  }

  export type DailyChallengeAnswerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DailyChallengeAnswer to aggregate.
     */
    where?: DailyChallengeAnswerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DailyChallengeAnswers to fetch.
     */
    orderBy?: DailyChallengeAnswerOrderByWithRelationInput | DailyChallengeAnswerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DailyChallengeAnswerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DailyChallengeAnswers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DailyChallengeAnswers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DailyChallengeAnswers
    **/
    _count?: true | DailyChallengeAnswerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DailyChallengeAnswerAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DailyChallengeAnswerSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DailyChallengeAnswerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DailyChallengeAnswerMaxAggregateInputType
  }

  export type GetDailyChallengeAnswerAggregateType<T extends DailyChallengeAnswerAggregateArgs> = {
        [P in keyof T & keyof AggregateDailyChallengeAnswer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDailyChallengeAnswer[P]>
      : GetScalarType<T[P], AggregateDailyChallengeAnswer[P]>
  }




  export type DailyChallengeAnswerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DailyChallengeAnswerWhereInput
    orderBy?: DailyChallengeAnswerOrderByWithAggregationInput | DailyChallengeAnswerOrderByWithAggregationInput[]
    by: DailyChallengeAnswerScalarFieldEnum[] | DailyChallengeAnswerScalarFieldEnum
    having?: DailyChallengeAnswerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DailyChallengeAnswerCountAggregateInputType | true
    _avg?: DailyChallengeAnswerAvgAggregateInputType
    _sum?: DailyChallengeAnswerSumAggregateInputType
    _min?: DailyChallengeAnswerMinAggregateInputType
    _max?: DailyChallengeAnswerMaxAggregateInputType
  }

  export type DailyChallengeAnswerGroupByOutputType = {
    id: string
    challengeId: string
    userId: string
    userAnswers: JsonValue
    isCorrect: boolean
    score: number
    timeSpent: number
    hintsUsed: number
    completedAt: Date
    _count: DailyChallengeAnswerCountAggregateOutputType | null
    _avg: DailyChallengeAnswerAvgAggregateOutputType | null
    _sum: DailyChallengeAnswerSumAggregateOutputType | null
    _min: DailyChallengeAnswerMinAggregateOutputType | null
    _max: DailyChallengeAnswerMaxAggregateOutputType | null
  }

  type GetDailyChallengeAnswerGroupByPayload<T extends DailyChallengeAnswerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DailyChallengeAnswerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DailyChallengeAnswerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DailyChallengeAnswerGroupByOutputType[P]>
            : GetScalarType<T[P], DailyChallengeAnswerGroupByOutputType[P]>
        }
      >
    >


  export type DailyChallengeAnswerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    challengeId?: boolean
    userId?: boolean
    userAnswers?: boolean
    isCorrect?: boolean
    score?: boolean
    timeSpent?: boolean
    hintsUsed?: boolean
    completedAt?: boolean
    challenge?: boolean | DailyChallengeDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dailyChallengeAnswer"]>

  export type DailyChallengeAnswerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    challengeId?: boolean
    userId?: boolean
    userAnswers?: boolean
    isCorrect?: boolean
    score?: boolean
    timeSpent?: boolean
    hintsUsed?: boolean
    completedAt?: boolean
    challenge?: boolean | DailyChallengeDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dailyChallengeAnswer"]>

  export type DailyChallengeAnswerSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    challengeId?: boolean
    userId?: boolean
    userAnswers?: boolean
    isCorrect?: boolean
    score?: boolean
    timeSpent?: boolean
    hintsUsed?: boolean
    completedAt?: boolean
    challenge?: boolean | DailyChallengeDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dailyChallengeAnswer"]>

  export type DailyChallengeAnswerSelectScalar = {
    id?: boolean
    challengeId?: boolean
    userId?: boolean
    userAnswers?: boolean
    isCorrect?: boolean
    score?: boolean
    timeSpent?: boolean
    hintsUsed?: boolean
    completedAt?: boolean
  }

  export type DailyChallengeAnswerOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "challengeId" | "userId" | "userAnswers" | "isCorrect" | "score" | "timeSpent" | "hintsUsed" | "completedAt", ExtArgs["result"]["dailyChallengeAnswer"]>
  export type DailyChallengeAnswerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    challenge?: boolean | DailyChallengeDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type DailyChallengeAnswerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    challenge?: boolean | DailyChallengeDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type DailyChallengeAnswerIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    challenge?: boolean | DailyChallengeDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $DailyChallengeAnswerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DailyChallengeAnswer"
    objects: {
      challenge: Prisma.$DailyChallengePayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      challengeId: string
      userId: string
      userAnswers: Prisma.JsonValue
      isCorrect: boolean
      score: number
      timeSpent: number
      hintsUsed: number
      completedAt: Date
    }, ExtArgs["result"]["dailyChallengeAnswer"]>
    composites: {}
  }

  type DailyChallengeAnswerGetPayload<S extends boolean | null | undefined | DailyChallengeAnswerDefaultArgs> = $Result.GetResult<Prisma.$DailyChallengeAnswerPayload, S>

  type DailyChallengeAnswerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DailyChallengeAnswerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DailyChallengeAnswerCountAggregateInputType | true
    }

  export interface DailyChallengeAnswerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DailyChallengeAnswer'], meta: { name: 'DailyChallengeAnswer' } }
    /**
     * Find zero or one DailyChallengeAnswer that matches the filter.
     * @param {DailyChallengeAnswerFindUniqueArgs} args - Arguments to find a DailyChallengeAnswer
     * @example
     * // Get one DailyChallengeAnswer
     * const dailyChallengeAnswer = await prisma.dailyChallengeAnswer.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DailyChallengeAnswerFindUniqueArgs>(args: SelectSubset<T, DailyChallengeAnswerFindUniqueArgs<ExtArgs>>): Prisma__DailyChallengeAnswerClient<$Result.GetResult<Prisma.$DailyChallengeAnswerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DailyChallengeAnswer that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DailyChallengeAnswerFindUniqueOrThrowArgs} args - Arguments to find a DailyChallengeAnswer
     * @example
     * // Get one DailyChallengeAnswer
     * const dailyChallengeAnswer = await prisma.dailyChallengeAnswer.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DailyChallengeAnswerFindUniqueOrThrowArgs>(args: SelectSubset<T, DailyChallengeAnswerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DailyChallengeAnswerClient<$Result.GetResult<Prisma.$DailyChallengeAnswerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DailyChallengeAnswer that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyChallengeAnswerFindFirstArgs} args - Arguments to find a DailyChallengeAnswer
     * @example
     * // Get one DailyChallengeAnswer
     * const dailyChallengeAnswer = await prisma.dailyChallengeAnswer.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DailyChallengeAnswerFindFirstArgs>(args?: SelectSubset<T, DailyChallengeAnswerFindFirstArgs<ExtArgs>>): Prisma__DailyChallengeAnswerClient<$Result.GetResult<Prisma.$DailyChallengeAnswerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DailyChallengeAnswer that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyChallengeAnswerFindFirstOrThrowArgs} args - Arguments to find a DailyChallengeAnswer
     * @example
     * // Get one DailyChallengeAnswer
     * const dailyChallengeAnswer = await prisma.dailyChallengeAnswer.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DailyChallengeAnswerFindFirstOrThrowArgs>(args?: SelectSubset<T, DailyChallengeAnswerFindFirstOrThrowArgs<ExtArgs>>): Prisma__DailyChallengeAnswerClient<$Result.GetResult<Prisma.$DailyChallengeAnswerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DailyChallengeAnswers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyChallengeAnswerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DailyChallengeAnswers
     * const dailyChallengeAnswers = await prisma.dailyChallengeAnswer.findMany()
     * 
     * // Get first 10 DailyChallengeAnswers
     * const dailyChallengeAnswers = await prisma.dailyChallengeAnswer.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const dailyChallengeAnswerWithIdOnly = await prisma.dailyChallengeAnswer.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DailyChallengeAnswerFindManyArgs>(args?: SelectSubset<T, DailyChallengeAnswerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DailyChallengeAnswerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DailyChallengeAnswer.
     * @param {DailyChallengeAnswerCreateArgs} args - Arguments to create a DailyChallengeAnswer.
     * @example
     * // Create one DailyChallengeAnswer
     * const DailyChallengeAnswer = await prisma.dailyChallengeAnswer.create({
     *   data: {
     *     // ... data to create a DailyChallengeAnswer
     *   }
     * })
     * 
     */
    create<T extends DailyChallengeAnswerCreateArgs>(args: SelectSubset<T, DailyChallengeAnswerCreateArgs<ExtArgs>>): Prisma__DailyChallengeAnswerClient<$Result.GetResult<Prisma.$DailyChallengeAnswerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DailyChallengeAnswers.
     * @param {DailyChallengeAnswerCreateManyArgs} args - Arguments to create many DailyChallengeAnswers.
     * @example
     * // Create many DailyChallengeAnswers
     * const dailyChallengeAnswer = await prisma.dailyChallengeAnswer.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DailyChallengeAnswerCreateManyArgs>(args?: SelectSubset<T, DailyChallengeAnswerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DailyChallengeAnswers and returns the data saved in the database.
     * @param {DailyChallengeAnswerCreateManyAndReturnArgs} args - Arguments to create many DailyChallengeAnswers.
     * @example
     * // Create many DailyChallengeAnswers
     * const dailyChallengeAnswer = await prisma.dailyChallengeAnswer.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DailyChallengeAnswers and only return the `id`
     * const dailyChallengeAnswerWithIdOnly = await prisma.dailyChallengeAnswer.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DailyChallengeAnswerCreateManyAndReturnArgs>(args?: SelectSubset<T, DailyChallengeAnswerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DailyChallengeAnswerPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DailyChallengeAnswer.
     * @param {DailyChallengeAnswerDeleteArgs} args - Arguments to delete one DailyChallengeAnswer.
     * @example
     * // Delete one DailyChallengeAnswer
     * const DailyChallengeAnswer = await prisma.dailyChallengeAnswer.delete({
     *   where: {
     *     // ... filter to delete one DailyChallengeAnswer
     *   }
     * })
     * 
     */
    delete<T extends DailyChallengeAnswerDeleteArgs>(args: SelectSubset<T, DailyChallengeAnswerDeleteArgs<ExtArgs>>): Prisma__DailyChallengeAnswerClient<$Result.GetResult<Prisma.$DailyChallengeAnswerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DailyChallengeAnswer.
     * @param {DailyChallengeAnswerUpdateArgs} args - Arguments to update one DailyChallengeAnswer.
     * @example
     * // Update one DailyChallengeAnswer
     * const dailyChallengeAnswer = await prisma.dailyChallengeAnswer.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DailyChallengeAnswerUpdateArgs>(args: SelectSubset<T, DailyChallengeAnswerUpdateArgs<ExtArgs>>): Prisma__DailyChallengeAnswerClient<$Result.GetResult<Prisma.$DailyChallengeAnswerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DailyChallengeAnswers.
     * @param {DailyChallengeAnswerDeleteManyArgs} args - Arguments to filter DailyChallengeAnswers to delete.
     * @example
     * // Delete a few DailyChallengeAnswers
     * const { count } = await prisma.dailyChallengeAnswer.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DailyChallengeAnswerDeleteManyArgs>(args?: SelectSubset<T, DailyChallengeAnswerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DailyChallengeAnswers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyChallengeAnswerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DailyChallengeAnswers
     * const dailyChallengeAnswer = await prisma.dailyChallengeAnswer.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DailyChallengeAnswerUpdateManyArgs>(args: SelectSubset<T, DailyChallengeAnswerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DailyChallengeAnswers and returns the data updated in the database.
     * @param {DailyChallengeAnswerUpdateManyAndReturnArgs} args - Arguments to update many DailyChallengeAnswers.
     * @example
     * // Update many DailyChallengeAnswers
     * const dailyChallengeAnswer = await prisma.dailyChallengeAnswer.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DailyChallengeAnswers and only return the `id`
     * const dailyChallengeAnswerWithIdOnly = await prisma.dailyChallengeAnswer.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DailyChallengeAnswerUpdateManyAndReturnArgs>(args: SelectSubset<T, DailyChallengeAnswerUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DailyChallengeAnswerPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DailyChallengeAnswer.
     * @param {DailyChallengeAnswerUpsertArgs} args - Arguments to update or create a DailyChallengeAnswer.
     * @example
     * // Update or create a DailyChallengeAnswer
     * const dailyChallengeAnswer = await prisma.dailyChallengeAnswer.upsert({
     *   create: {
     *     // ... data to create a DailyChallengeAnswer
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DailyChallengeAnswer we want to update
     *   }
     * })
     */
    upsert<T extends DailyChallengeAnswerUpsertArgs>(args: SelectSubset<T, DailyChallengeAnswerUpsertArgs<ExtArgs>>): Prisma__DailyChallengeAnswerClient<$Result.GetResult<Prisma.$DailyChallengeAnswerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DailyChallengeAnswers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyChallengeAnswerCountArgs} args - Arguments to filter DailyChallengeAnswers to count.
     * @example
     * // Count the number of DailyChallengeAnswers
     * const count = await prisma.dailyChallengeAnswer.count({
     *   where: {
     *     // ... the filter for the DailyChallengeAnswers we want to count
     *   }
     * })
    **/
    count<T extends DailyChallengeAnswerCountArgs>(
      args?: Subset<T, DailyChallengeAnswerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DailyChallengeAnswerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DailyChallengeAnswer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyChallengeAnswerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DailyChallengeAnswerAggregateArgs>(args: Subset<T, DailyChallengeAnswerAggregateArgs>): Prisma.PrismaPromise<GetDailyChallengeAnswerAggregateType<T>>

    /**
     * Group by DailyChallengeAnswer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DailyChallengeAnswerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DailyChallengeAnswerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DailyChallengeAnswerGroupByArgs['orderBy'] }
        : { orderBy?: DailyChallengeAnswerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DailyChallengeAnswerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDailyChallengeAnswerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DailyChallengeAnswer model
   */
  readonly fields: DailyChallengeAnswerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DailyChallengeAnswer.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DailyChallengeAnswerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    challenge<T extends DailyChallengeDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DailyChallengeDefaultArgs<ExtArgs>>): Prisma__DailyChallengeClient<$Result.GetResult<Prisma.$DailyChallengePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DailyChallengeAnswer model
   */
  interface DailyChallengeAnswerFieldRefs {
    readonly id: FieldRef<"DailyChallengeAnswer", 'String'>
    readonly challengeId: FieldRef<"DailyChallengeAnswer", 'String'>
    readonly userId: FieldRef<"DailyChallengeAnswer", 'String'>
    readonly userAnswers: FieldRef<"DailyChallengeAnswer", 'Json'>
    readonly isCorrect: FieldRef<"DailyChallengeAnswer", 'Boolean'>
    readonly score: FieldRef<"DailyChallengeAnswer", 'Int'>
    readonly timeSpent: FieldRef<"DailyChallengeAnswer", 'Int'>
    readonly hintsUsed: FieldRef<"DailyChallengeAnswer", 'Int'>
    readonly completedAt: FieldRef<"DailyChallengeAnswer", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DailyChallengeAnswer findUnique
   */
  export type DailyChallengeAnswerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyChallengeAnswer
     */
    select?: DailyChallengeAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyChallengeAnswer
     */
    omit?: DailyChallengeAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyChallengeAnswerInclude<ExtArgs> | null
    /**
     * Filter, which DailyChallengeAnswer to fetch.
     */
    where: DailyChallengeAnswerWhereUniqueInput
  }

  /**
   * DailyChallengeAnswer findUniqueOrThrow
   */
  export type DailyChallengeAnswerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyChallengeAnswer
     */
    select?: DailyChallengeAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyChallengeAnswer
     */
    omit?: DailyChallengeAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyChallengeAnswerInclude<ExtArgs> | null
    /**
     * Filter, which DailyChallengeAnswer to fetch.
     */
    where: DailyChallengeAnswerWhereUniqueInput
  }

  /**
   * DailyChallengeAnswer findFirst
   */
  export type DailyChallengeAnswerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyChallengeAnswer
     */
    select?: DailyChallengeAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyChallengeAnswer
     */
    omit?: DailyChallengeAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyChallengeAnswerInclude<ExtArgs> | null
    /**
     * Filter, which DailyChallengeAnswer to fetch.
     */
    where?: DailyChallengeAnswerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DailyChallengeAnswers to fetch.
     */
    orderBy?: DailyChallengeAnswerOrderByWithRelationInput | DailyChallengeAnswerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DailyChallengeAnswers.
     */
    cursor?: DailyChallengeAnswerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DailyChallengeAnswers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DailyChallengeAnswers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DailyChallengeAnswers.
     */
    distinct?: DailyChallengeAnswerScalarFieldEnum | DailyChallengeAnswerScalarFieldEnum[]
  }

  /**
   * DailyChallengeAnswer findFirstOrThrow
   */
  export type DailyChallengeAnswerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyChallengeAnswer
     */
    select?: DailyChallengeAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyChallengeAnswer
     */
    omit?: DailyChallengeAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyChallengeAnswerInclude<ExtArgs> | null
    /**
     * Filter, which DailyChallengeAnswer to fetch.
     */
    where?: DailyChallengeAnswerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DailyChallengeAnswers to fetch.
     */
    orderBy?: DailyChallengeAnswerOrderByWithRelationInput | DailyChallengeAnswerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DailyChallengeAnswers.
     */
    cursor?: DailyChallengeAnswerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DailyChallengeAnswers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DailyChallengeAnswers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DailyChallengeAnswers.
     */
    distinct?: DailyChallengeAnswerScalarFieldEnum | DailyChallengeAnswerScalarFieldEnum[]
  }

  /**
   * DailyChallengeAnswer findMany
   */
  export type DailyChallengeAnswerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyChallengeAnswer
     */
    select?: DailyChallengeAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyChallengeAnswer
     */
    omit?: DailyChallengeAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyChallengeAnswerInclude<ExtArgs> | null
    /**
     * Filter, which DailyChallengeAnswers to fetch.
     */
    where?: DailyChallengeAnswerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DailyChallengeAnswers to fetch.
     */
    orderBy?: DailyChallengeAnswerOrderByWithRelationInput | DailyChallengeAnswerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DailyChallengeAnswers.
     */
    cursor?: DailyChallengeAnswerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DailyChallengeAnswers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DailyChallengeAnswers.
     */
    skip?: number
    distinct?: DailyChallengeAnswerScalarFieldEnum | DailyChallengeAnswerScalarFieldEnum[]
  }

  /**
   * DailyChallengeAnswer create
   */
  export type DailyChallengeAnswerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyChallengeAnswer
     */
    select?: DailyChallengeAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyChallengeAnswer
     */
    omit?: DailyChallengeAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyChallengeAnswerInclude<ExtArgs> | null
    /**
     * The data needed to create a DailyChallengeAnswer.
     */
    data: XOR<DailyChallengeAnswerCreateInput, DailyChallengeAnswerUncheckedCreateInput>
  }

  /**
   * DailyChallengeAnswer createMany
   */
  export type DailyChallengeAnswerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DailyChallengeAnswers.
     */
    data: DailyChallengeAnswerCreateManyInput | DailyChallengeAnswerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DailyChallengeAnswer createManyAndReturn
   */
  export type DailyChallengeAnswerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyChallengeAnswer
     */
    select?: DailyChallengeAnswerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DailyChallengeAnswer
     */
    omit?: DailyChallengeAnswerOmit<ExtArgs> | null
    /**
     * The data used to create many DailyChallengeAnswers.
     */
    data: DailyChallengeAnswerCreateManyInput | DailyChallengeAnswerCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyChallengeAnswerIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DailyChallengeAnswer update
   */
  export type DailyChallengeAnswerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyChallengeAnswer
     */
    select?: DailyChallengeAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyChallengeAnswer
     */
    omit?: DailyChallengeAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyChallengeAnswerInclude<ExtArgs> | null
    /**
     * The data needed to update a DailyChallengeAnswer.
     */
    data: XOR<DailyChallengeAnswerUpdateInput, DailyChallengeAnswerUncheckedUpdateInput>
    /**
     * Choose, which DailyChallengeAnswer to update.
     */
    where: DailyChallengeAnswerWhereUniqueInput
  }

  /**
   * DailyChallengeAnswer updateMany
   */
  export type DailyChallengeAnswerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DailyChallengeAnswers.
     */
    data: XOR<DailyChallengeAnswerUpdateManyMutationInput, DailyChallengeAnswerUncheckedUpdateManyInput>
    /**
     * Filter which DailyChallengeAnswers to update
     */
    where?: DailyChallengeAnswerWhereInput
    /**
     * Limit how many DailyChallengeAnswers to update.
     */
    limit?: number
  }

  /**
   * DailyChallengeAnswer updateManyAndReturn
   */
  export type DailyChallengeAnswerUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyChallengeAnswer
     */
    select?: DailyChallengeAnswerSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DailyChallengeAnswer
     */
    omit?: DailyChallengeAnswerOmit<ExtArgs> | null
    /**
     * The data used to update DailyChallengeAnswers.
     */
    data: XOR<DailyChallengeAnswerUpdateManyMutationInput, DailyChallengeAnswerUncheckedUpdateManyInput>
    /**
     * Filter which DailyChallengeAnswers to update
     */
    where?: DailyChallengeAnswerWhereInput
    /**
     * Limit how many DailyChallengeAnswers to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyChallengeAnswerIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * DailyChallengeAnswer upsert
   */
  export type DailyChallengeAnswerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyChallengeAnswer
     */
    select?: DailyChallengeAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyChallengeAnswer
     */
    omit?: DailyChallengeAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyChallengeAnswerInclude<ExtArgs> | null
    /**
     * The filter to search for the DailyChallengeAnswer to update in case it exists.
     */
    where: DailyChallengeAnswerWhereUniqueInput
    /**
     * In case the DailyChallengeAnswer found by the `where` argument doesn't exist, create a new DailyChallengeAnswer with this data.
     */
    create: XOR<DailyChallengeAnswerCreateInput, DailyChallengeAnswerUncheckedCreateInput>
    /**
     * In case the DailyChallengeAnswer was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DailyChallengeAnswerUpdateInput, DailyChallengeAnswerUncheckedUpdateInput>
  }

  /**
   * DailyChallengeAnswer delete
   */
  export type DailyChallengeAnswerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyChallengeAnswer
     */
    select?: DailyChallengeAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyChallengeAnswer
     */
    omit?: DailyChallengeAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyChallengeAnswerInclude<ExtArgs> | null
    /**
     * Filter which DailyChallengeAnswer to delete.
     */
    where: DailyChallengeAnswerWhereUniqueInput
  }

  /**
   * DailyChallengeAnswer deleteMany
   */
  export type DailyChallengeAnswerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DailyChallengeAnswers to delete
     */
    where?: DailyChallengeAnswerWhereInput
    /**
     * Limit how many DailyChallengeAnswers to delete.
     */
    limit?: number
  }

  /**
   * DailyChallengeAnswer without action
   */
  export type DailyChallengeAnswerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DailyChallengeAnswer
     */
    select?: DailyChallengeAnswerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DailyChallengeAnswer
     */
    omit?: DailyChallengeAnswerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DailyChallengeAnswerInclude<ExtArgs> | null
  }


  /**
   * Model Leaderboard
   */

  export type AggregateLeaderboard = {
    _count: LeaderboardCountAggregateOutputType | null
    _avg: LeaderboardAvgAggregateOutputType | null
    _sum: LeaderboardSumAggregateOutputType | null
    _min: LeaderboardMinAggregateOutputType | null
    _max: LeaderboardMaxAggregateOutputType | null
  }

  export type LeaderboardAvgAggregateOutputType = {
    globalRank: number | null
    weeklyRank: number | null
    monthlyRank: number | null
    totalScore: number | null
    gamesPlayed: number | null
    gamesWon: number | null
    winRate: number | null
    currentStreak: number | null
    bestStreak: number | null
  }

  export type LeaderboardSumAggregateOutputType = {
    globalRank: number | null
    weeklyRank: number | null
    monthlyRank: number | null
    totalScore: number | null
    gamesPlayed: number | null
    gamesWon: number | null
    winRate: number | null
    currentStreak: number | null
    bestStreak: number | null
  }

  export type LeaderboardMinAggregateOutputType = {
    id: string | null
    userId: string | null
    globalRank: number | null
    weeklyRank: number | null
    monthlyRank: number | null
    totalScore: number | null
    gamesPlayed: number | null
    gamesWon: number | null
    winRate: number | null
    currentStreak: number | null
    bestStreak: number | null
    lastUpdated: Date | null
  }

  export type LeaderboardMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    globalRank: number | null
    weeklyRank: number | null
    monthlyRank: number | null
    totalScore: number | null
    gamesPlayed: number | null
    gamesWon: number | null
    winRate: number | null
    currentStreak: number | null
    bestStreak: number | null
    lastUpdated: Date | null
  }

  export type LeaderboardCountAggregateOutputType = {
    id: number
    userId: number
    globalRank: number
    weeklyRank: number
    monthlyRank: number
    totalScore: number
    gamesPlayed: number
    gamesWon: number
    winRate: number
    currentStreak: number
    bestStreak: number
    lastUpdated: number
    _all: number
  }


  export type LeaderboardAvgAggregateInputType = {
    globalRank?: true
    weeklyRank?: true
    monthlyRank?: true
    totalScore?: true
    gamesPlayed?: true
    gamesWon?: true
    winRate?: true
    currentStreak?: true
    bestStreak?: true
  }

  export type LeaderboardSumAggregateInputType = {
    globalRank?: true
    weeklyRank?: true
    monthlyRank?: true
    totalScore?: true
    gamesPlayed?: true
    gamesWon?: true
    winRate?: true
    currentStreak?: true
    bestStreak?: true
  }

  export type LeaderboardMinAggregateInputType = {
    id?: true
    userId?: true
    globalRank?: true
    weeklyRank?: true
    monthlyRank?: true
    totalScore?: true
    gamesPlayed?: true
    gamesWon?: true
    winRate?: true
    currentStreak?: true
    bestStreak?: true
    lastUpdated?: true
  }

  export type LeaderboardMaxAggregateInputType = {
    id?: true
    userId?: true
    globalRank?: true
    weeklyRank?: true
    monthlyRank?: true
    totalScore?: true
    gamesPlayed?: true
    gamesWon?: true
    winRate?: true
    currentStreak?: true
    bestStreak?: true
    lastUpdated?: true
  }

  export type LeaderboardCountAggregateInputType = {
    id?: true
    userId?: true
    globalRank?: true
    weeklyRank?: true
    monthlyRank?: true
    totalScore?: true
    gamesPlayed?: true
    gamesWon?: true
    winRate?: true
    currentStreak?: true
    bestStreak?: true
    lastUpdated?: true
    _all?: true
  }

  export type LeaderboardAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Leaderboard to aggregate.
     */
    where?: LeaderboardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Leaderboards to fetch.
     */
    orderBy?: LeaderboardOrderByWithRelationInput | LeaderboardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LeaderboardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Leaderboards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Leaderboards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Leaderboards
    **/
    _count?: true | LeaderboardCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LeaderboardAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LeaderboardSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LeaderboardMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LeaderboardMaxAggregateInputType
  }

  export type GetLeaderboardAggregateType<T extends LeaderboardAggregateArgs> = {
        [P in keyof T & keyof AggregateLeaderboard]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLeaderboard[P]>
      : GetScalarType<T[P], AggregateLeaderboard[P]>
  }




  export type LeaderboardGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LeaderboardWhereInput
    orderBy?: LeaderboardOrderByWithAggregationInput | LeaderboardOrderByWithAggregationInput[]
    by: LeaderboardScalarFieldEnum[] | LeaderboardScalarFieldEnum
    having?: LeaderboardScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LeaderboardCountAggregateInputType | true
    _avg?: LeaderboardAvgAggregateInputType
    _sum?: LeaderboardSumAggregateInputType
    _min?: LeaderboardMinAggregateInputType
    _max?: LeaderboardMaxAggregateInputType
  }

  export type LeaderboardGroupByOutputType = {
    id: string
    userId: string
    globalRank: number
    weeklyRank: number | null
    monthlyRank: number | null
    totalScore: number
    gamesPlayed: number
    gamesWon: number
    winRate: number
    currentStreak: number
    bestStreak: number
    lastUpdated: Date
    _count: LeaderboardCountAggregateOutputType | null
    _avg: LeaderboardAvgAggregateOutputType | null
    _sum: LeaderboardSumAggregateOutputType | null
    _min: LeaderboardMinAggregateOutputType | null
    _max: LeaderboardMaxAggregateOutputType | null
  }

  type GetLeaderboardGroupByPayload<T extends LeaderboardGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LeaderboardGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LeaderboardGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LeaderboardGroupByOutputType[P]>
            : GetScalarType<T[P], LeaderboardGroupByOutputType[P]>
        }
      >
    >


  export type LeaderboardSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    globalRank?: boolean
    weeklyRank?: boolean
    monthlyRank?: boolean
    totalScore?: boolean
    gamesPlayed?: boolean
    gamesWon?: boolean
    winRate?: boolean
    currentStreak?: boolean
    bestStreak?: boolean
    lastUpdated?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["leaderboard"]>

  export type LeaderboardSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    globalRank?: boolean
    weeklyRank?: boolean
    monthlyRank?: boolean
    totalScore?: boolean
    gamesPlayed?: boolean
    gamesWon?: boolean
    winRate?: boolean
    currentStreak?: boolean
    bestStreak?: boolean
    lastUpdated?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["leaderboard"]>

  export type LeaderboardSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    globalRank?: boolean
    weeklyRank?: boolean
    monthlyRank?: boolean
    totalScore?: boolean
    gamesPlayed?: boolean
    gamesWon?: boolean
    winRate?: boolean
    currentStreak?: boolean
    bestStreak?: boolean
    lastUpdated?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["leaderboard"]>

  export type LeaderboardSelectScalar = {
    id?: boolean
    userId?: boolean
    globalRank?: boolean
    weeklyRank?: boolean
    monthlyRank?: boolean
    totalScore?: boolean
    gamesPlayed?: boolean
    gamesWon?: boolean
    winRate?: boolean
    currentStreak?: boolean
    bestStreak?: boolean
    lastUpdated?: boolean
  }

  export type LeaderboardOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "globalRank" | "weeklyRank" | "monthlyRank" | "totalScore" | "gamesPlayed" | "gamesWon" | "winRate" | "currentStreak" | "bestStreak" | "lastUpdated", ExtArgs["result"]["leaderboard"]>
  export type LeaderboardInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type LeaderboardIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type LeaderboardIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $LeaderboardPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Leaderboard"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      globalRank: number
      weeklyRank: number | null
      monthlyRank: number | null
      totalScore: number
      gamesPlayed: number
      gamesWon: number
      winRate: number
      currentStreak: number
      bestStreak: number
      lastUpdated: Date
    }, ExtArgs["result"]["leaderboard"]>
    composites: {}
  }

  type LeaderboardGetPayload<S extends boolean | null | undefined | LeaderboardDefaultArgs> = $Result.GetResult<Prisma.$LeaderboardPayload, S>

  type LeaderboardCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LeaderboardFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LeaderboardCountAggregateInputType | true
    }

  export interface LeaderboardDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Leaderboard'], meta: { name: 'Leaderboard' } }
    /**
     * Find zero or one Leaderboard that matches the filter.
     * @param {LeaderboardFindUniqueArgs} args - Arguments to find a Leaderboard
     * @example
     * // Get one Leaderboard
     * const leaderboard = await prisma.leaderboard.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LeaderboardFindUniqueArgs>(args: SelectSubset<T, LeaderboardFindUniqueArgs<ExtArgs>>): Prisma__LeaderboardClient<$Result.GetResult<Prisma.$LeaderboardPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Leaderboard that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LeaderboardFindUniqueOrThrowArgs} args - Arguments to find a Leaderboard
     * @example
     * // Get one Leaderboard
     * const leaderboard = await prisma.leaderboard.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LeaderboardFindUniqueOrThrowArgs>(args: SelectSubset<T, LeaderboardFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LeaderboardClient<$Result.GetResult<Prisma.$LeaderboardPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Leaderboard that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeaderboardFindFirstArgs} args - Arguments to find a Leaderboard
     * @example
     * // Get one Leaderboard
     * const leaderboard = await prisma.leaderboard.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LeaderboardFindFirstArgs>(args?: SelectSubset<T, LeaderboardFindFirstArgs<ExtArgs>>): Prisma__LeaderboardClient<$Result.GetResult<Prisma.$LeaderboardPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Leaderboard that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeaderboardFindFirstOrThrowArgs} args - Arguments to find a Leaderboard
     * @example
     * // Get one Leaderboard
     * const leaderboard = await prisma.leaderboard.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LeaderboardFindFirstOrThrowArgs>(args?: SelectSubset<T, LeaderboardFindFirstOrThrowArgs<ExtArgs>>): Prisma__LeaderboardClient<$Result.GetResult<Prisma.$LeaderboardPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Leaderboards that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeaderboardFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Leaderboards
     * const leaderboards = await prisma.leaderboard.findMany()
     * 
     * // Get first 10 Leaderboards
     * const leaderboards = await prisma.leaderboard.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const leaderboardWithIdOnly = await prisma.leaderboard.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LeaderboardFindManyArgs>(args?: SelectSubset<T, LeaderboardFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeaderboardPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Leaderboard.
     * @param {LeaderboardCreateArgs} args - Arguments to create a Leaderboard.
     * @example
     * // Create one Leaderboard
     * const Leaderboard = await prisma.leaderboard.create({
     *   data: {
     *     // ... data to create a Leaderboard
     *   }
     * })
     * 
     */
    create<T extends LeaderboardCreateArgs>(args: SelectSubset<T, LeaderboardCreateArgs<ExtArgs>>): Prisma__LeaderboardClient<$Result.GetResult<Prisma.$LeaderboardPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Leaderboards.
     * @param {LeaderboardCreateManyArgs} args - Arguments to create many Leaderboards.
     * @example
     * // Create many Leaderboards
     * const leaderboard = await prisma.leaderboard.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LeaderboardCreateManyArgs>(args?: SelectSubset<T, LeaderboardCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Leaderboards and returns the data saved in the database.
     * @param {LeaderboardCreateManyAndReturnArgs} args - Arguments to create many Leaderboards.
     * @example
     * // Create many Leaderboards
     * const leaderboard = await prisma.leaderboard.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Leaderboards and only return the `id`
     * const leaderboardWithIdOnly = await prisma.leaderboard.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LeaderboardCreateManyAndReturnArgs>(args?: SelectSubset<T, LeaderboardCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeaderboardPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Leaderboard.
     * @param {LeaderboardDeleteArgs} args - Arguments to delete one Leaderboard.
     * @example
     * // Delete one Leaderboard
     * const Leaderboard = await prisma.leaderboard.delete({
     *   where: {
     *     // ... filter to delete one Leaderboard
     *   }
     * })
     * 
     */
    delete<T extends LeaderboardDeleteArgs>(args: SelectSubset<T, LeaderboardDeleteArgs<ExtArgs>>): Prisma__LeaderboardClient<$Result.GetResult<Prisma.$LeaderboardPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Leaderboard.
     * @param {LeaderboardUpdateArgs} args - Arguments to update one Leaderboard.
     * @example
     * // Update one Leaderboard
     * const leaderboard = await prisma.leaderboard.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LeaderboardUpdateArgs>(args: SelectSubset<T, LeaderboardUpdateArgs<ExtArgs>>): Prisma__LeaderboardClient<$Result.GetResult<Prisma.$LeaderboardPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Leaderboards.
     * @param {LeaderboardDeleteManyArgs} args - Arguments to filter Leaderboards to delete.
     * @example
     * // Delete a few Leaderboards
     * const { count } = await prisma.leaderboard.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LeaderboardDeleteManyArgs>(args?: SelectSubset<T, LeaderboardDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Leaderboards.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeaderboardUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Leaderboards
     * const leaderboard = await prisma.leaderboard.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LeaderboardUpdateManyArgs>(args: SelectSubset<T, LeaderboardUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Leaderboards and returns the data updated in the database.
     * @param {LeaderboardUpdateManyAndReturnArgs} args - Arguments to update many Leaderboards.
     * @example
     * // Update many Leaderboards
     * const leaderboard = await prisma.leaderboard.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Leaderboards and only return the `id`
     * const leaderboardWithIdOnly = await prisma.leaderboard.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LeaderboardUpdateManyAndReturnArgs>(args: SelectSubset<T, LeaderboardUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeaderboardPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Leaderboard.
     * @param {LeaderboardUpsertArgs} args - Arguments to update or create a Leaderboard.
     * @example
     * // Update or create a Leaderboard
     * const leaderboard = await prisma.leaderboard.upsert({
     *   create: {
     *     // ... data to create a Leaderboard
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Leaderboard we want to update
     *   }
     * })
     */
    upsert<T extends LeaderboardUpsertArgs>(args: SelectSubset<T, LeaderboardUpsertArgs<ExtArgs>>): Prisma__LeaderboardClient<$Result.GetResult<Prisma.$LeaderboardPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Leaderboards.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeaderboardCountArgs} args - Arguments to filter Leaderboards to count.
     * @example
     * // Count the number of Leaderboards
     * const count = await prisma.leaderboard.count({
     *   where: {
     *     // ... the filter for the Leaderboards we want to count
     *   }
     * })
    **/
    count<T extends LeaderboardCountArgs>(
      args?: Subset<T, LeaderboardCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LeaderboardCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Leaderboard.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeaderboardAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LeaderboardAggregateArgs>(args: Subset<T, LeaderboardAggregateArgs>): Prisma.PrismaPromise<GetLeaderboardAggregateType<T>>

    /**
     * Group by Leaderboard.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeaderboardGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LeaderboardGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LeaderboardGroupByArgs['orderBy'] }
        : { orderBy?: LeaderboardGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LeaderboardGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLeaderboardGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Leaderboard model
   */
  readonly fields: LeaderboardFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Leaderboard.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LeaderboardClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Leaderboard model
   */
  interface LeaderboardFieldRefs {
    readonly id: FieldRef<"Leaderboard", 'String'>
    readonly userId: FieldRef<"Leaderboard", 'String'>
    readonly globalRank: FieldRef<"Leaderboard", 'Int'>
    readonly weeklyRank: FieldRef<"Leaderboard", 'Int'>
    readonly monthlyRank: FieldRef<"Leaderboard", 'Int'>
    readonly totalScore: FieldRef<"Leaderboard", 'Int'>
    readonly gamesPlayed: FieldRef<"Leaderboard", 'Int'>
    readonly gamesWon: FieldRef<"Leaderboard", 'Int'>
    readonly winRate: FieldRef<"Leaderboard", 'Float'>
    readonly currentStreak: FieldRef<"Leaderboard", 'Int'>
    readonly bestStreak: FieldRef<"Leaderboard", 'Int'>
    readonly lastUpdated: FieldRef<"Leaderboard", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Leaderboard findUnique
   */
  export type LeaderboardFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Leaderboard
     */
    select?: LeaderboardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Leaderboard
     */
    omit?: LeaderboardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaderboardInclude<ExtArgs> | null
    /**
     * Filter, which Leaderboard to fetch.
     */
    where: LeaderboardWhereUniqueInput
  }

  /**
   * Leaderboard findUniqueOrThrow
   */
  export type LeaderboardFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Leaderboard
     */
    select?: LeaderboardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Leaderboard
     */
    omit?: LeaderboardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaderboardInclude<ExtArgs> | null
    /**
     * Filter, which Leaderboard to fetch.
     */
    where: LeaderboardWhereUniqueInput
  }

  /**
   * Leaderboard findFirst
   */
  export type LeaderboardFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Leaderboard
     */
    select?: LeaderboardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Leaderboard
     */
    omit?: LeaderboardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaderboardInclude<ExtArgs> | null
    /**
     * Filter, which Leaderboard to fetch.
     */
    where?: LeaderboardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Leaderboards to fetch.
     */
    orderBy?: LeaderboardOrderByWithRelationInput | LeaderboardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Leaderboards.
     */
    cursor?: LeaderboardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Leaderboards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Leaderboards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Leaderboards.
     */
    distinct?: LeaderboardScalarFieldEnum | LeaderboardScalarFieldEnum[]
  }

  /**
   * Leaderboard findFirstOrThrow
   */
  export type LeaderboardFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Leaderboard
     */
    select?: LeaderboardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Leaderboard
     */
    omit?: LeaderboardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaderboardInclude<ExtArgs> | null
    /**
     * Filter, which Leaderboard to fetch.
     */
    where?: LeaderboardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Leaderboards to fetch.
     */
    orderBy?: LeaderboardOrderByWithRelationInput | LeaderboardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Leaderboards.
     */
    cursor?: LeaderboardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Leaderboards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Leaderboards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Leaderboards.
     */
    distinct?: LeaderboardScalarFieldEnum | LeaderboardScalarFieldEnum[]
  }

  /**
   * Leaderboard findMany
   */
  export type LeaderboardFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Leaderboard
     */
    select?: LeaderboardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Leaderboard
     */
    omit?: LeaderboardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaderboardInclude<ExtArgs> | null
    /**
     * Filter, which Leaderboards to fetch.
     */
    where?: LeaderboardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Leaderboards to fetch.
     */
    orderBy?: LeaderboardOrderByWithRelationInput | LeaderboardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Leaderboards.
     */
    cursor?: LeaderboardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Leaderboards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Leaderboards.
     */
    skip?: number
    distinct?: LeaderboardScalarFieldEnum | LeaderboardScalarFieldEnum[]
  }

  /**
   * Leaderboard create
   */
  export type LeaderboardCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Leaderboard
     */
    select?: LeaderboardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Leaderboard
     */
    omit?: LeaderboardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaderboardInclude<ExtArgs> | null
    /**
     * The data needed to create a Leaderboard.
     */
    data: XOR<LeaderboardCreateInput, LeaderboardUncheckedCreateInput>
  }

  /**
   * Leaderboard createMany
   */
  export type LeaderboardCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Leaderboards.
     */
    data: LeaderboardCreateManyInput | LeaderboardCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Leaderboard createManyAndReturn
   */
  export type LeaderboardCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Leaderboard
     */
    select?: LeaderboardSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Leaderboard
     */
    omit?: LeaderboardOmit<ExtArgs> | null
    /**
     * The data used to create many Leaderboards.
     */
    data: LeaderboardCreateManyInput | LeaderboardCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaderboardIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Leaderboard update
   */
  export type LeaderboardUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Leaderboard
     */
    select?: LeaderboardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Leaderboard
     */
    omit?: LeaderboardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaderboardInclude<ExtArgs> | null
    /**
     * The data needed to update a Leaderboard.
     */
    data: XOR<LeaderboardUpdateInput, LeaderboardUncheckedUpdateInput>
    /**
     * Choose, which Leaderboard to update.
     */
    where: LeaderboardWhereUniqueInput
  }

  /**
   * Leaderboard updateMany
   */
  export type LeaderboardUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Leaderboards.
     */
    data: XOR<LeaderboardUpdateManyMutationInput, LeaderboardUncheckedUpdateManyInput>
    /**
     * Filter which Leaderboards to update
     */
    where?: LeaderboardWhereInput
    /**
     * Limit how many Leaderboards to update.
     */
    limit?: number
  }

  /**
   * Leaderboard updateManyAndReturn
   */
  export type LeaderboardUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Leaderboard
     */
    select?: LeaderboardSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Leaderboard
     */
    omit?: LeaderboardOmit<ExtArgs> | null
    /**
     * The data used to update Leaderboards.
     */
    data: XOR<LeaderboardUpdateManyMutationInput, LeaderboardUncheckedUpdateManyInput>
    /**
     * Filter which Leaderboards to update
     */
    where?: LeaderboardWhereInput
    /**
     * Limit how many Leaderboards to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaderboardIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Leaderboard upsert
   */
  export type LeaderboardUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Leaderboard
     */
    select?: LeaderboardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Leaderboard
     */
    omit?: LeaderboardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaderboardInclude<ExtArgs> | null
    /**
     * The filter to search for the Leaderboard to update in case it exists.
     */
    where: LeaderboardWhereUniqueInput
    /**
     * In case the Leaderboard found by the `where` argument doesn't exist, create a new Leaderboard with this data.
     */
    create: XOR<LeaderboardCreateInput, LeaderboardUncheckedCreateInput>
    /**
     * In case the Leaderboard was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LeaderboardUpdateInput, LeaderboardUncheckedUpdateInput>
  }

  /**
   * Leaderboard delete
   */
  export type LeaderboardDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Leaderboard
     */
    select?: LeaderboardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Leaderboard
     */
    omit?: LeaderboardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaderboardInclude<ExtArgs> | null
    /**
     * Filter which Leaderboard to delete.
     */
    where: LeaderboardWhereUniqueInput
  }

  /**
   * Leaderboard deleteMany
   */
  export type LeaderboardDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Leaderboards to delete
     */
    where?: LeaderboardWhereInput
    /**
     * Limit how many Leaderboards to delete.
     */
    limit?: number
  }

  /**
   * Leaderboard without action
   */
  export type LeaderboardDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Leaderboard
     */
    select?: LeaderboardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Leaderboard
     */
    omit?: LeaderboardOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaderboardInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    username: 'username',
    firstName: 'firstName',
    lastName: 'lastName',
    phone: 'phone',
    avatar: 'avatar',
    status: 'status',
    totalScore: 'totalScore',
    gamesPlayed: 'gamesPlayed',
    gamesWon: 'gamesWon',
    winRate: 'winRate',
    currentStreak: 'currentStreak',
    bestStreak: 'bestStreak',
    lastActive: 'lastActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const PasswordResetTokenScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    token: 'token',
    expiresAt: 'expiresAt',
    used: 'used',
    createdAt: 'createdAt',
    usedAt: 'usedAt'
  };

  export type PasswordResetTokenScalarFieldEnum = (typeof PasswordResetTokenScalarFieldEnum)[keyof typeof PasswordResetTokenScalarFieldEnum]


  export const UserSessionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    sessionToken: 'sessionToken',
    deviceInfo: 'deviceInfo',
    ipAddress: 'ipAddress',
    userAgent: 'userAgent',
    status: 'status',
    createdAt: 'createdAt',
    expiresAt: 'expiresAt',
    lastActivity: 'lastActivity'
  };

  export type UserSessionScalarFieldEnum = (typeof UserSessionScalarFieldEnum)[keyof typeof UserSessionScalarFieldEnum]


  export const FriendshipScalarFieldEnum: {
    id: 'id',
    requesterId: 'requesterId',
    receiverId: 'receiverId',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type FriendshipScalarFieldEnum = (typeof FriendshipScalarFieldEnum)[keyof typeof FriendshipScalarFieldEnum]


  export const GameSessionScalarFieldEnum: {
    id: 'id',
    roomCode: 'roomCode',
    gameType: 'gameType',
    status: 'status',
    maxPlayers: 'maxPlayers',
    currentRound: 'currentRound',
    totalRounds: 'totalRounds',
    maxMistakes: 'maxMistakes',
    difficulty: 'difficulty',
    timeLimit: 'timeLimit',
    createdAt: 'createdAt',
    startedAt: 'startedAt',
    endedAt: 'endedAt',
    updatedAt: 'updatedAt'
  };

  export type GameSessionScalarFieldEnum = (typeof GameSessionScalarFieldEnum)[keyof typeof GameSessionScalarFieldEnum]


  export const GameParticipantScalarFieldEnum: {
    id: 'id',
    gameSessionId: 'gameSessionId',
    userId: 'userId',
    position: 'position',
    isReady: 'isReady',
    isConnected: 'isConnected',
    finalScore: 'finalScore',
    finalRank: 'finalRank',
    mistakeCount: 'mistakeCount',
    joinedAt: 'joinedAt',
    leftAt: 'leftAt'
  };

  export type GameParticipantScalarFieldEnum = (typeof GameParticipantScalarFieldEnum)[keyof typeof GameParticipantScalarFieldEnum]


  export const GameRoundScalarFieldEnum: {
    id: 'id',
    gameSessionId: 'gameSessionId',
    roundNumber: 'roundNumber',
    verse: 'verse',
    blanks: 'blanks',
    emojiMapping: 'emojiMapping',
    correctBook: 'correctBook',
    correctRef: 'correctRef',
    context: 'context',
    startedAt: 'startedAt',
    endedAt: 'endedAt'
  };

  export type GameRoundScalarFieldEnum = (typeof GameRoundScalarFieldEnum)[keyof typeof GameRoundScalarFieldEnum]


  export const GameScoreScalarFieldEnum: {
    id: 'id',
    participantId: 'participantId',
    roundId: 'roundId',
    blanksScore: 'blanksScore',
    contextScore: 'contextScore',
    bookScore: 'bookScore',
    referenceScore: 'referenceScore',
    timeBonus: 'timeBonus',
    streakBonus: 'streakBonus',
    totalScore: 'totalScore',
    timeSpent: 'timeSpent',
    mistakesMade: 'mistakesMade',
    hintsUsed: 'hintsUsed',
    createdAt: 'createdAt'
  };

  export type GameScoreScalarFieldEnum = (typeof GameScoreScalarFieldEnum)[keyof typeof GameScoreScalarFieldEnum]


  export const DailyChallengeScalarFieldEnum: {
    id: 'id',
    date: 'date',
    verse: 'verse',
    blanks: 'blanks',
    emojiMapping: 'emojiMapping',
    correctBook: 'correctBook',
    correctRef: 'correctRef',
    context: 'context',
    difficulty: 'difficulty',
    maxAttempts: 'maxAttempts',
    timeLimit: 'timeLimit',
    isActive: 'isActive',
    createdAt: 'createdAt'
  };

  export type DailyChallengeScalarFieldEnum = (typeof DailyChallengeScalarFieldEnum)[keyof typeof DailyChallengeScalarFieldEnum]


  export const DailyChallengeAnswerScalarFieldEnum: {
    id: 'id',
    challengeId: 'challengeId',
    userId: 'userId',
    userAnswers: 'userAnswers',
    isCorrect: 'isCorrect',
    score: 'score',
    timeSpent: 'timeSpent',
    hintsUsed: 'hintsUsed',
    completedAt: 'completedAt'
  };

  export type DailyChallengeAnswerScalarFieldEnum = (typeof DailyChallengeAnswerScalarFieldEnum)[keyof typeof DailyChallengeAnswerScalarFieldEnum]


  export const LeaderboardScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    globalRank: 'globalRank',
    weeklyRank: 'weeklyRank',
    monthlyRank: 'monthlyRank',
    totalScore: 'totalScore',
    gamesPlayed: 'gamesPlayed',
    gamesWon: 'gamesWon',
    winRate: 'winRate',
    currentStreak: 'currentStreak',
    bestStreak: 'bestStreak',
    lastUpdated: 'lastUpdated'
  };

  export type LeaderboardScalarFieldEnum = (typeof LeaderboardScalarFieldEnum)[keyof typeof LeaderboardScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'UserStatus'
   */
  export type EnumUserStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserStatus'>
    


  /**
   * Reference to a field of type 'UserStatus[]'
   */
  export type ListEnumUserStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserStatus[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'SessionStatus'
   */
  export type EnumSessionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SessionStatus'>
    


  /**
   * Reference to a field of type 'SessionStatus[]'
   */
  export type ListEnumSessionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SessionStatus[]'>
    


  /**
   * Reference to a field of type 'FriendshipStatus'
   */
  export type EnumFriendshipStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FriendshipStatus'>
    


  /**
   * Reference to a field of type 'FriendshipStatus[]'
   */
  export type ListEnumFriendshipStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FriendshipStatus[]'>
    


  /**
   * Reference to a field of type 'GameType'
   */
  export type EnumGameTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GameType'>
    


  /**
   * Reference to a field of type 'GameType[]'
   */
  export type ListEnumGameTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GameType[]'>
    


  /**
   * Reference to a field of type 'GameStatus'
   */
  export type EnumGameStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GameStatus'>
    


  /**
   * Reference to a field of type 'GameStatus[]'
   */
  export type ListEnumGameStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GameStatus[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: UuidFilter<"User"> | string
    email?: StringFilter<"User"> | string
    username?: StringFilter<"User"> | string
    firstName?: StringFilter<"User"> | string
    lastName?: StringFilter<"User"> | string
    phone?: StringNullableFilter<"User"> | string | null
    avatar?: StringNullableFilter<"User"> | string | null
    status?: EnumUserStatusFilter<"User"> | $Enums.UserStatus
    totalScore?: IntFilter<"User"> | number
    gamesPlayed?: IntFilter<"User"> | number
    gamesWon?: IntFilter<"User"> | number
    winRate?: FloatFilter<"User"> | number
    currentStreak?: IntFilter<"User"> | number
    bestStreak?: IntFilter<"User"> | number
    lastActive?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    sessions?: UserSessionListRelationFilter
    passwordResetTokens?: PasswordResetTokenListRelationFilter
    sentFriendRequests?: FriendshipListRelationFilter
    receivedFriendRequests?: FriendshipListRelationFilter
    gameParticipations?: GameParticipantListRelationFilter
    dailyChallengeAnswers?: DailyChallengeAnswerListRelationFilter
    leaderboardEntry?: XOR<LeaderboardNullableScalarRelationFilter, LeaderboardWhereInput> | null
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    phone?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    status?: SortOrder
    totalScore?: SortOrder
    gamesPlayed?: SortOrder
    gamesWon?: SortOrder
    winRate?: SortOrder
    currentStreak?: SortOrder
    bestStreak?: SortOrder
    lastActive?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    sessions?: UserSessionOrderByRelationAggregateInput
    passwordResetTokens?: PasswordResetTokenOrderByRelationAggregateInput
    sentFriendRequests?: FriendshipOrderByRelationAggregateInput
    receivedFriendRequests?: FriendshipOrderByRelationAggregateInput
    gameParticipations?: GameParticipantOrderByRelationAggregateInput
    dailyChallengeAnswers?: DailyChallengeAnswerOrderByRelationAggregateInput
    leaderboardEntry?: LeaderboardOrderByWithRelationInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    username?: string
    phone?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    firstName?: StringFilter<"User"> | string
    lastName?: StringFilter<"User"> | string
    avatar?: StringNullableFilter<"User"> | string | null
    status?: EnumUserStatusFilter<"User"> | $Enums.UserStatus
    totalScore?: IntFilter<"User"> | number
    gamesPlayed?: IntFilter<"User"> | number
    gamesWon?: IntFilter<"User"> | number
    winRate?: FloatFilter<"User"> | number
    currentStreak?: IntFilter<"User"> | number
    bestStreak?: IntFilter<"User"> | number
    lastActive?: DateTimeNullableFilter<"User"> | Date | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    sessions?: UserSessionListRelationFilter
    passwordResetTokens?: PasswordResetTokenListRelationFilter
    sentFriendRequests?: FriendshipListRelationFilter
    receivedFriendRequests?: FriendshipListRelationFilter
    gameParticipations?: GameParticipantListRelationFilter
    dailyChallengeAnswers?: DailyChallengeAnswerListRelationFilter
    leaderboardEntry?: XOR<LeaderboardNullableScalarRelationFilter, LeaderboardWhereInput> | null
  }, "id" | "email" | "username" | "phone">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    phone?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    status?: SortOrder
    totalScore?: SortOrder
    gamesPlayed?: SortOrder
    gamesWon?: SortOrder
    winRate?: SortOrder
    currentStreak?: SortOrder
    bestStreak?: SortOrder
    lastActive?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    username?: StringWithAggregatesFilter<"User"> | string
    firstName?: StringWithAggregatesFilter<"User"> | string
    lastName?: StringWithAggregatesFilter<"User"> | string
    phone?: StringNullableWithAggregatesFilter<"User"> | string | null
    avatar?: StringNullableWithAggregatesFilter<"User"> | string | null
    status?: EnumUserStatusWithAggregatesFilter<"User"> | $Enums.UserStatus
    totalScore?: IntWithAggregatesFilter<"User"> | number
    gamesPlayed?: IntWithAggregatesFilter<"User"> | number
    gamesWon?: IntWithAggregatesFilter<"User"> | number
    winRate?: FloatWithAggregatesFilter<"User"> | number
    currentStreak?: IntWithAggregatesFilter<"User"> | number
    bestStreak?: IntWithAggregatesFilter<"User"> | number
    lastActive?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type PasswordResetTokenWhereInput = {
    AND?: PasswordResetTokenWhereInput | PasswordResetTokenWhereInput[]
    OR?: PasswordResetTokenWhereInput[]
    NOT?: PasswordResetTokenWhereInput | PasswordResetTokenWhereInput[]
    id?: UuidFilter<"PasswordResetToken"> | string
    userId?: UuidFilter<"PasswordResetToken"> | string
    token?: StringFilter<"PasswordResetToken"> | string
    expiresAt?: DateTimeFilter<"PasswordResetToken"> | Date | string
    used?: BoolFilter<"PasswordResetToken"> | boolean
    createdAt?: DateTimeFilter<"PasswordResetToken"> | Date | string
    usedAt?: DateTimeNullableFilter<"PasswordResetToken"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type PasswordResetTokenOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    used?: SortOrder
    createdAt?: SortOrder
    usedAt?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type PasswordResetTokenWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    token?: string
    AND?: PasswordResetTokenWhereInput | PasswordResetTokenWhereInput[]
    OR?: PasswordResetTokenWhereInput[]
    NOT?: PasswordResetTokenWhereInput | PasswordResetTokenWhereInput[]
    userId?: UuidFilter<"PasswordResetToken"> | string
    expiresAt?: DateTimeFilter<"PasswordResetToken"> | Date | string
    used?: BoolFilter<"PasswordResetToken"> | boolean
    createdAt?: DateTimeFilter<"PasswordResetToken"> | Date | string
    usedAt?: DateTimeNullableFilter<"PasswordResetToken"> | Date | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "token">

  export type PasswordResetTokenOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    used?: SortOrder
    createdAt?: SortOrder
    usedAt?: SortOrderInput | SortOrder
    _count?: PasswordResetTokenCountOrderByAggregateInput
    _max?: PasswordResetTokenMaxOrderByAggregateInput
    _min?: PasswordResetTokenMinOrderByAggregateInput
  }

  export type PasswordResetTokenScalarWhereWithAggregatesInput = {
    AND?: PasswordResetTokenScalarWhereWithAggregatesInput | PasswordResetTokenScalarWhereWithAggregatesInput[]
    OR?: PasswordResetTokenScalarWhereWithAggregatesInput[]
    NOT?: PasswordResetTokenScalarWhereWithAggregatesInput | PasswordResetTokenScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"PasswordResetToken"> | string
    userId?: UuidWithAggregatesFilter<"PasswordResetToken"> | string
    token?: StringWithAggregatesFilter<"PasswordResetToken"> | string
    expiresAt?: DateTimeWithAggregatesFilter<"PasswordResetToken"> | Date | string
    used?: BoolWithAggregatesFilter<"PasswordResetToken"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"PasswordResetToken"> | Date | string
    usedAt?: DateTimeNullableWithAggregatesFilter<"PasswordResetToken"> | Date | string | null
  }

  export type UserSessionWhereInput = {
    AND?: UserSessionWhereInput | UserSessionWhereInput[]
    OR?: UserSessionWhereInput[]
    NOT?: UserSessionWhereInput | UserSessionWhereInput[]
    id?: UuidFilter<"UserSession"> | string
    userId?: UuidFilter<"UserSession"> | string
    sessionToken?: StringFilter<"UserSession"> | string
    deviceInfo?: JsonNullableFilter<"UserSession">
    ipAddress?: StringNullableFilter<"UserSession"> | string | null
    userAgent?: StringNullableFilter<"UserSession"> | string | null
    status?: EnumSessionStatusFilter<"UserSession"> | $Enums.SessionStatus
    createdAt?: DateTimeFilter<"UserSession"> | Date | string
    expiresAt?: DateTimeFilter<"UserSession"> | Date | string
    lastActivity?: DateTimeFilter<"UserSession"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type UserSessionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    sessionToken?: SortOrder
    deviceInfo?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    lastActivity?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type UserSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sessionToken?: string
    AND?: UserSessionWhereInput | UserSessionWhereInput[]
    OR?: UserSessionWhereInput[]
    NOT?: UserSessionWhereInput | UserSessionWhereInput[]
    userId?: UuidFilter<"UserSession"> | string
    deviceInfo?: JsonNullableFilter<"UserSession">
    ipAddress?: StringNullableFilter<"UserSession"> | string | null
    userAgent?: StringNullableFilter<"UserSession"> | string | null
    status?: EnumSessionStatusFilter<"UserSession"> | $Enums.SessionStatus
    createdAt?: DateTimeFilter<"UserSession"> | Date | string
    expiresAt?: DateTimeFilter<"UserSession"> | Date | string
    lastActivity?: DateTimeFilter<"UserSession"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "sessionToken">

  export type UserSessionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    sessionToken?: SortOrder
    deviceInfo?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    lastActivity?: SortOrder
    _count?: UserSessionCountOrderByAggregateInput
    _max?: UserSessionMaxOrderByAggregateInput
    _min?: UserSessionMinOrderByAggregateInput
  }

  export type UserSessionScalarWhereWithAggregatesInput = {
    AND?: UserSessionScalarWhereWithAggregatesInput | UserSessionScalarWhereWithAggregatesInput[]
    OR?: UserSessionScalarWhereWithAggregatesInput[]
    NOT?: UserSessionScalarWhereWithAggregatesInput | UserSessionScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"UserSession"> | string
    userId?: UuidWithAggregatesFilter<"UserSession"> | string
    sessionToken?: StringWithAggregatesFilter<"UserSession"> | string
    deviceInfo?: JsonNullableWithAggregatesFilter<"UserSession">
    ipAddress?: StringNullableWithAggregatesFilter<"UserSession"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"UserSession"> | string | null
    status?: EnumSessionStatusWithAggregatesFilter<"UserSession"> | $Enums.SessionStatus
    createdAt?: DateTimeWithAggregatesFilter<"UserSession"> | Date | string
    expiresAt?: DateTimeWithAggregatesFilter<"UserSession"> | Date | string
    lastActivity?: DateTimeWithAggregatesFilter<"UserSession"> | Date | string
  }

  export type FriendshipWhereInput = {
    AND?: FriendshipWhereInput | FriendshipWhereInput[]
    OR?: FriendshipWhereInput[]
    NOT?: FriendshipWhereInput | FriendshipWhereInput[]
    id?: UuidFilter<"Friendship"> | string
    requesterId?: UuidFilter<"Friendship"> | string
    receiverId?: UuidFilter<"Friendship"> | string
    status?: EnumFriendshipStatusFilter<"Friendship"> | $Enums.FriendshipStatus
    createdAt?: DateTimeFilter<"Friendship"> | Date | string
    updatedAt?: DateTimeFilter<"Friendship"> | Date | string
    requester?: XOR<UserScalarRelationFilter, UserWhereInput>
    receiver?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type FriendshipOrderByWithRelationInput = {
    id?: SortOrder
    requesterId?: SortOrder
    receiverId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    requester?: UserOrderByWithRelationInput
    receiver?: UserOrderByWithRelationInput
  }

  export type FriendshipWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    requesterId_receiverId?: FriendshipRequesterIdReceiverIdCompoundUniqueInput
    AND?: FriendshipWhereInput | FriendshipWhereInput[]
    OR?: FriendshipWhereInput[]
    NOT?: FriendshipWhereInput | FriendshipWhereInput[]
    requesterId?: UuidFilter<"Friendship"> | string
    receiverId?: UuidFilter<"Friendship"> | string
    status?: EnumFriendshipStatusFilter<"Friendship"> | $Enums.FriendshipStatus
    createdAt?: DateTimeFilter<"Friendship"> | Date | string
    updatedAt?: DateTimeFilter<"Friendship"> | Date | string
    requester?: XOR<UserScalarRelationFilter, UserWhereInput>
    receiver?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "requesterId_receiverId">

  export type FriendshipOrderByWithAggregationInput = {
    id?: SortOrder
    requesterId?: SortOrder
    receiverId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: FriendshipCountOrderByAggregateInput
    _max?: FriendshipMaxOrderByAggregateInput
    _min?: FriendshipMinOrderByAggregateInput
  }

  export type FriendshipScalarWhereWithAggregatesInput = {
    AND?: FriendshipScalarWhereWithAggregatesInput | FriendshipScalarWhereWithAggregatesInput[]
    OR?: FriendshipScalarWhereWithAggregatesInput[]
    NOT?: FriendshipScalarWhereWithAggregatesInput | FriendshipScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Friendship"> | string
    requesterId?: UuidWithAggregatesFilter<"Friendship"> | string
    receiverId?: UuidWithAggregatesFilter<"Friendship"> | string
    status?: EnumFriendshipStatusWithAggregatesFilter<"Friendship"> | $Enums.FriendshipStatus
    createdAt?: DateTimeWithAggregatesFilter<"Friendship"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Friendship"> | Date | string
  }

  export type GameSessionWhereInput = {
    AND?: GameSessionWhereInput | GameSessionWhereInput[]
    OR?: GameSessionWhereInput[]
    NOT?: GameSessionWhereInput | GameSessionWhereInput[]
    id?: UuidFilter<"GameSession"> | string
    roomCode?: StringNullableFilter<"GameSession"> | string | null
    gameType?: EnumGameTypeFilter<"GameSession"> | $Enums.GameType
    status?: EnumGameStatusFilter<"GameSession"> | $Enums.GameStatus
    maxPlayers?: IntFilter<"GameSession"> | number
    currentRound?: IntFilter<"GameSession"> | number
    totalRounds?: IntFilter<"GameSession"> | number
    maxMistakes?: IntFilter<"GameSession"> | number
    difficulty?: StringFilter<"GameSession"> | string
    timeLimit?: IntNullableFilter<"GameSession"> | number | null
    createdAt?: DateTimeFilter<"GameSession"> | Date | string
    startedAt?: DateTimeNullableFilter<"GameSession"> | Date | string | null
    endedAt?: DateTimeNullableFilter<"GameSession"> | Date | string | null
    updatedAt?: DateTimeFilter<"GameSession"> | Date | string
    participants?: GameParticipantListRelationFilter
    rounds?: GameRoundListRelationFilter
  }

  export type GameSessionOrderByWithRelationInput = {
    id?: SortOrder
    roomCode?: SortOrderInput | SortOrder
    gameType?: SortOrder
    status?: SortOrder
    maxPlayers?: SortOrder
    currentRound?: SortOrder
    totalRounds?: SortOrder
    maxMistakes?: SortOrder
    difficulty?: SortOrder
    timeLimit?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    startedAt?: SortOrderInput | SortOrder
    endedAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    participants?: GameParticipantOrderByRelationAggregateInput
    rounds?: GameRoundOrderByRelationAggregateInput
  }

  export type GameSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    roomCode?: string
    AND?: GameSessionWhereInput | GameSessionWhereInput[]
    OR?: GameSessionWhereInput[]
    NOT?: GameSessionWhereInput | GameSessionWhereInput[]
    gameType?: EnumGameTypeFilter<"GameSession"> | $Enums.GameType
    status?: EnumGameStatusFilter<"GameSession"> | $Enums.GameStatus
    maxPlayers?: IntFilter<"GameSession"> | number
    currentRound?: IntFilter<"GameSession"> | number
    totalRounds?: IntFilter<"GameSession"> | number
    maxMistakes?: IntFilter<"GameSession"> | number
    difficulty?: StringFilter<"GameSession"> | string
    timeLimit?: IntNullableFilter<"GameSession"> | number | null
    createdAt?: DateTimeFilter<"GameSession"> | Date | string
    startedAt?: DateTimeNullableFilter<"GameSession"> | Date | string | null
    endedAt?: DateTimeNullableFilter<"GameSession"> | Date | string | null
    updatedAt?: DateTimeFilter<"GameSession"> | Date | string
    participants?: GameParticipantListRelationFilter
    rounds?: GameRoundListRelationFilter
  }, "id" | "roomCode">

  export type GameSessionOrderByWithAggregationInput = {
    id?: SortOrder
    roomCode?: SortOrderInput | SortOrder
    gameType?: SortOrder
    status?: SortOrder
    maxPlayers?: SortOrder
    currentRound?: SortOrder
    totalRounds?: SortOrder
    maxMistakes?: SortOrder
    difficulty?: SortOrder
    timeLimit?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    startedAt?: SortOrderInput | SortOrder
    endedAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    _count?: GameSessionCountOrderByAggregateInput
    _avg?: GameSessionAvgOrderByAggregateInput
    _max?: GameSessionMaxOrderByAggregateInput
    _min?: GameSessionMinOrderByAggregateInput
    _sum?: GameSessionSumOrderByAggregateInput
  }

  export type GameSessionScalarWhereWithAggregatesInput = {
    AND?: GameSessionScalarWhereWithAggregatesInput | GameSessionScalarWhereWithAggregatesInput[]
    OR?: GameSessionScalarWhereWithAggregatesInput[]
    NOT?: GameSessionScalarWhereWithAggregatesInput | GameSessionScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"GameSession"> | string
    roomCode?: StringNullableWithAggregatesFilter<"GameSession"> | string | null
    gameType?: EnumGameTypeWithAggregatesFilter<"GameSession"> | $Enums.GameType
    status?: EnumGameStatusWithAggregatesFilter<"GameSession"> | $Enums.GameStatus
    maxPlayers?: IntWithAggregatesFilter<"GameSession"> | number
    currentRound?: IntWithAggregatesFilter<"GameSession"> | number
    totalRounds?: IntWithAggregatesFilter<"GameSession"> | number
    maxMistakes?: IntWithAggregatesFilter<"GameSession"> | number
    difficulty?: StringWithAggregatesFilter<"GameSession"> | string
    timeLimit?: IntNullableWithAggregatesFilter<"GameSession"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"GameSession"> | Date | string
    startedAt?: DateTimeNullableWithAggregatesFilter<"GameSession"> | Date | string | null
    endedAt?: DateTimeNullableWithAggregatesFilter<"GameSession"> | Date | string | null
    updatedAt?: DateTimeWithAggregatesFilter<"GameSession"> | Date | string
  }

  export type GameParticipantWhereInput = {
    AND?: GameParticipantWhereInput | GameParticipantWhereInput[]
    OR?: GameParticipantWhereInput[]
    NOT?: GameParticipantWhereInput | GameParticipantWhereInput[]
    id?: UuidFilter<"GameParticipant"> | string
    gameSessionId?: UuidFilter<"GameParticipant"> | string
    userId?: UuidFilter<"GameParticipant"> | string
    position?: IntFilter<"GameParticipant"> | number
    isReady?: BoolFilter<"GameParticipant"> | boolean
    isConnected?: BoolFilter<"GameParticipant"> | boolean
    finalScore?: IntFilter<"GameParticipant"> | number
    finalRank?: IntNullableFilter<"GameParticipant"> | number | null
    mistakeCount?: IntFilter<"GameParticipant"> | number
    joinedAt?: DateTimeFilter<"GameParticipant"> | Date | string
    leftAt?: DateTimeNullableFilter<"GameParticipant"> | Date | string | null
    gameSession?: XOR<GameSessionScalarRelationFilter, GameSessionWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    scores?: GameScoreListRelationFilter
  }

  export type GameParticipantOrderByWithRelationInput = {
    id?: SortOrder
    gameSessionId?: SortOrder
    userId?: SortOrder
    position?: SortOrder
    isReady?: SortOrder
    isConnected?: SortOrder
    finalScore?: SortOrder
    finalRank?: SortOrderInput | SortOrder
    mistakeCount?: SortOrder
    joinedAt?: SortOrder
    leftAt?: SortOrderInput | SortOrder
    gameSession?: GameSessionOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
    scores?: GameScoreOrderByRelationAggregateInput
  }

  export type GameParticipantWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    gameSessionId_userId?: GameParticipantGameSessionIdUserIdCompoundUniqueInput
    AND?: GameParticipantWhereInput | GameParticipantWhereInput[]
    OR?: GameParticipantWhereInput[]
    NOT?: GameParticipantWhereInput | GameParticipantWhereInput[]
    gameSessionId?: UuidFilter<"GameParticipant"> | string
    userId?: UuidFilter<"GameParticipant"> | string
    position?: IntFilter<"GameParticipant"> | number
    isReady?: BoolFilter<"GameParticipant"> | boolean
    isConnected?: BoolFilter<"GameParticipant"> | boolean
    finalScore?: IntFilter<"GameParticipant"> | number
    finalRank?: IntNullableFilter<"GameParticipant"> | number | null
    mistakeCount?: IntFilter<"GameParticipant"> | number
    joinedAt?: DateTimeFilter<"GameParticipant"> | Date | string
    leftAt?: DateTimeNullableFilter<"GameParticipant"> | Date | string | null
    gameSession?: XOR<GameSessionScalarRelationFilter, GameSessionWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    scores?: GameScoreListRelationFilter
  }, "id" | "gameSessionId_userId">

  export type GameParticipantOrderByWithAggregationInput = {
    id?: SortOrder
    gameSessionId?: SortOrder
    userId?: SortOrder
    position?: SortOrder
    isReady?: SortOrder
    isConnected?: SortOrder
    finalScore?: SortOrder
    finalRank?: SortOrderInput | SortOrder
    mistakeCount?: SortOrder
    joinedAt?: SortOrder
    leftAt?: SortOrderInput | SortOrder
    _count?: GameParticipantCountOrderByAggregateInput
    _avg?: GameParticipantAvgOrderByAggregateInput
    _max?: GameParticipantMaxOrderByAggregateInput
    _min?: GameParticipantMinOrderByAggregateInput
    _sum?: GameParticipantSumOrderByAggregateInput
  }

  export type GameParticipantScalarWhereWithAggregatesInput = {
    AND?: GameParticipantScalarWhereWithAggregatesInput | GameParticipantScalarWhereWithAggregatesInput[]
    OR?: GameParticipantScalarWhereWithAggregatesInput[]
    NOT?: GameParticipantScalarWhereWithAggregatesInput | GameParticipantScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"GameParticipant"> | string
    gameSessionId?: UuidWithAggregatesFilter<"GameParticipant"> | string
    userId?: UuidWithAggregatesFilter<"GameParticipant"> | string
    position?: IntWithAggregatesFilter<"GameParticipant"> | number
    isReady?: BoolWithAggregatesFilter<"GameParticipant"> | boolean
    isConnected?: BoolWithAggregatesFilter<"GameParticipant"> | boolean
    finalScore?: IntWithAggregatesFilter<"GameParticipant"> | number
    finalRank?: IntNullableWithAggregatesFilter<"GameParticipant"> | number | null
    mistakeCount?: IntWithAggregatesFilter<"GameParticipant"> | number
    joinedAt?: DateTimeWithAggregatesFilter<"GameParticipant"> | Date | string
    leftAt?: DateTimeNullableWithAggregatesFilter<"GameParticipant"> | Date | string | null
  }

  export type GameRoundWhereInput = {
    AND?: GameRoundWhereInput | GameRoundWhereInput[]
    OR?: GameRoundWhereInput[]
    NOT?: GameRoundWhereInput | GameRoundWhereInput[]
    id?: UuidFilter<"GameRound"> | string
    gameSessionId?: UuidFilter<"GameRound"> | string
    roundNumber?: IntFilter<"GameRound"> | number
    verse?: StringFilter<"GameRound"> | string
    blanks?: JsonFilter<"GameRound">
    emojiMapping?: JsonFilter<"GameRound">
    correctBook?: StringFilter<"GameRound"> | string
    correctRef?: StringFilter<"GameRound"> | string
    context?: StringNullableFilter<"GameRound"> | string | null
    startedAt?: DateTimeNullableFilter<"GameRound"> | Date | string | null
    endedAt?: DateTimeNullableFilter<"GameRound"> | Date | string | null
    gameSession?: XOR<GameSessionScalarRelationFilter, GameSessionWhereInput>
    scores?: GameScoreListRelationFilter
  }

  export type GameRoundOrderByWithRelationInput = {
    id?: SortOrder
    gameSessionId?: SortOrder
    roundNumber?: SortOrder
    verse?: SortOrder
    blanks?: SortOrder
    emojiMapping?: SortOrder
    correctBook?: SortOrder
    correctRef?: SortOrder
    context?: SortOrderInput | SortOrder
    startedAt?: SortOrderInput | SortOrder
    endedAt?: SortOrderInput | SortOrder
    gameSession?: GameSessionOrderByWithRelationInput
    scores?: GameScoreOrderByRelationAggregateInput
  }

  export type GameRoundWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    gameSessionId_roundNumber?: GameRoundGameSessionIdRoundNumberCompoundUniqueInput
    AND?: GameRoundWhereInput | GameRoundWhereInput[]
    OR?: GameRoundWhereInput[]
    NOT?: GameRoundWhereInput | GameRoundWhereInput[]
    gameSessionId?: UuidFilter<"GameRound"> | string
    roundNumber?: IntFilter<"GameRound"> | number
    verse?: StringFilter<"GameRound"> | string
    blanks?: JsonFilter<"GameRound">
    emojiMapping?: JsonFilter<"GameRound">
    correctBook?: StringFilter<"GameRound"> | string
    correctRef?: StringFilter<"GameRound"> | string
    context?: StringNullableFilter<"GameRound"> | string | null
    startedAt?: DateTimeNullableFilter<"GameRound"> | Date | string | null
    endedAt?: DateTimeNullableFilter<"GameRound"> | Date | string | null
    gameSession?: XOR<GameSessionScalarRelationFilter, GameSessionWhereInput>
    scores?: GameScoreListRelationFilter
  }, "id" | "gameSessionId_roundNumber">

  export type GameRoundOrderByWithAggregationInput = {
    id?: SortOrder
    gameSessionId?: SortOrder
    roundNumber?: SortOrder
    verse?: SortOrder
    blanks?: SortOrder
    emojiMapping?: SortOrder
    correctBook?: SortOrder
    correctRef?: SortOrder
    context?: SortOrderInput | SortOrder
    startedAt?: SortOrderInput | SortOrder
    endedAt?: SortOrderInput | SortOrder
    _count?: GameRoundCountOrderByAggregateInput
    _avg?: GameRoundAvgOrderByAggregateInput
    _max?: GameRoundMaxOrderByAggregateInput
    _min?: GameRoundMinOrderByAggregateInput
    _sum?: GameRoundSumOrderByAggregateInput
  }

  export type GameRoundScalarWhereWithAggregatesInput = {
    AND?: GameRoundScalarWhereWithAggregatesInput | GameRoundScalarWhereWithAggregatesInput[]
    OR?: GameRoundScalarWhereWithAggregatesInput[]
    NOT?: GameRoundScalarWhereWithAggregatesInput | GameRoundScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"GameRound"> | string
    gameSessionId?: UuidWithAggregatesFilter<"GameRound"> | string
    roundNumber?: IntWithAggregatesFilter<"GameRound"> | number
    verse?: StringWithAggregatesFilter<"GameRound"> | string
    blanks?: JsonWithAggregatesFilter<"GameRound">
    emojiMapping?: JsonWithAggregatesFilter<"GameRound">
    correctBook?: StringWithAggregatesFilter<"GameRound"> | string
    correctRef?: StringWithAggregatesFilter<"GameRound"> | string
    context?: StringNullableWithAggregatesFilter<"GameRound"> | string | null
    startedAt?: DateTimeNullableWithAggregatesFilter<"GameRound"> | Date | string | null
    endedAt?: DateTimeNullableWithAggregatesFilter<"GameRound"> | Date | string | null
  }

  export type GameScoreWhereInput = {
    AND?: GameScoreWhereInput | GameScoreWhereInput[]
    OR?: GameScoreWhereInput[]
    NOT?: GameScoreWhereInput | GameScoreWhereInput[]
    id?: UuidFilter<"GameScore"> | string
    participantId?: UuidFilter<"GameScore"> | string
    roundId?: UuidFilter<"GameScore"> | string
    blanksScore?: IntFilter<"GameScore"> | number
    contextScore?: IntFilter<"GameScore"> | number
    bookScore?: IntFilter<"GameScore"> | number
    referenceScore?: IntFilter<"GameScore"> | number
    timeBonus?: IntFilter<"GameScore"> | number
    streakBonus?: IntFilter<"GameScore"> | number
    totalScore?: IntFilter<"GameScore"> | number
    timeSpent?: IntFilter<"GameScore"> | number
    mistakesMade?: IntFilter<"GameScore"> | number
    hintsUsed?: IntFilter<"GameScore"> | number
    createdAt?: DateTimeFilter<"GameScore"> | Date | string
    participant?: XOR<GameParticipantScalarRelationFilter, GameParticipantWhereInput>
    round?: XOR<GameRoundScalarRelationFilter, GameRoundWhereInput>
  }

  export type GameScoreOrderByWithRelationInput = {
    id?: SortOrder
    participantId?: SortOrder
    roundId?: SortOrder
    blanksScore?: SortOrder
    contextScore?: SortOrder
    bookScore?: SortOrder
    referenceScore?: SortOrder
    timeBonus?: SortOrder
    streakBonus?: SortOrder
    totalScore?: SortOrder
    timeSpent?: SortOrder
    mistakesMade?: SortOrder
    hintsUsed?: SortOrder
    createdAt?: SortOrder
    participant?: GameParticipantOrderByWithRelationInput
    round?: GameRoundOrderByWithRelationInput
  }

  export type GameScoreWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: GameScoreWhereInput | GameScoreWhereInput[]
    OR?: GameScoreWhereInput[]
    NOT?: GameScoreWhereInput | GameScoreWhereInput[]
    participantId?: UuidFilter<"GameScore"> | string
    roundId?: UuidFilter<"GameScore"> | string
    blanksScore?: IntFilter<"GameScore"> | number
    contextScore?: IntFilter<"GameScore"> | number
    bookScore?: IntFilter<"GameScore"> | number
    referenceScore?: IntFilter<"GameScore"> | number
    timeBonus?: IntFilter<"GameScore"> | number
    streakBonus?: IntFilter<"GameScore"> | number
    totalScore?: IntFilter<"GameScore"> | number
    timeSpent?: IntFilter<"GameScore"> | number
    mistakesMade?: IntFilter<"GameScore"> | number
    hintsUsed?: IntFilter<"GameScore"> | number
    createdAt?: DateTimeFilter<"GameScore"> | Date | string
    participant?: XOR<GameParticipantScalarRelationFilter, GameParticipantWhereInput>
    round?: XOR<GameRoundScalarRelationFilter, GameRoundWhereInput>
  }, "id">

  export type GameScoreOrderByWithAggregationInput = {
    id?: SortOrder
    participantId?: SortOrder
    roundId?: SortOrder
    blanksScore?: SortOrder
    contextScore?: SortOrder
    bookScore?: SortOrder
    referenceScore?: SortOrder
    timeBonus?: SortOrder
    streakBonus?: SortOrder
    totalScore?: SortOrder
    timeSpent?: SortOrder
    mistakesMade?: SortOrder
    hintsUsed?: SortOrder
    createdAt?: SortOrder
    _count?: GameScoreCountOrderByAggregateInput
    _avg?: GameScoreAvgOrderByAggregateInput
    _max?: GameScoreMaxOrderByAggregateInput
    _min?: GameScoreMinOrderByAggregateInput
    _sum?: GameScoreSumOrderByAggregateInput
  }

  export type GameScoreScalarWhereWithAggregatesInput = {
    AND?: GameScoreScalarWhereWithAggregatesInput | GameScoreScalarWhereWithAggregatesInput[]
    OR?: GameScoreScalarWhereWithAggregatesInput[]
    NOT?: GameScoreScalarWhereWithAggregatesInput | GameScoreScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"GameScore"> | string
    participantId?: UuidWithAggregatesFilter<"GameScore"> | string
    roundId?: UuidWithAggregatesFilter<"GameScore"> | string
    blanksScore?: IntWithAggregatesFilter<"GameScore"> | number
    contextScore?: IntWithAggregatesFilter<"GameScore"> | number
    bookScore?: IntWithAggregatesFilter<"GameScore"> | number
    referenceScore?: IntWithAggregatesFilter<"GameScore"> | number
    timeBonus?: IntWithAggregatesFilter<"GameScore"> | number
    streakBonus?: IntWithAggregatesFilter<"GameScore"> | number
    totalScore?: IntWithAggregatesFilter<"GameScore"> | number
    timeSpent?: IntWithAggregatesFilter<"GameScore"> | number
    mistakesMade?: IntWithAggregatesFilter<"GameScore"> | number
    hintsUsed?: IntWithAggregatesFilter<"GameScore"> | number
    createdAt?: DateTimeWithAggregatesFilter<"GameScore"> | Date | string
  }

  export type DailyChallengeWhereInput = {
    AND?: DailyChallengeWhereInput | DailyChallengeWhereInput[]
    OR?: DailyChallengeWhereInput[]
    NOT?: DailyChallengeWhereInput | DailyChallengeWhereInput[]
    id?: UuidFilter<"DailyChallenge"> | string
    date?: DateTimeFilter<"DailyChallenge"> | Date | string
    verse?: StringFilter<"DailyChallenge"> | string
    blanks?: JsonFilter<"DailyChallenge">
    emojiMapping?: JsonFilter<"DailyChallenge">
    correctBook?: StringFilter<"DailyChallenge"> | string
    correctRef?: StringFilter<"DailyChallenge"> | string
    context?: StringNullableFilter<"DailyChallenge"> | string | null
    difficulty?: StringFilter<"DailyChallenge"> | string
    maxAttempts?: IntFilter<"DailyChallenge"> | number
    timeLimit?: IntNullableFilter<"DailyChallenge"> | number | null
    isActive?: BoolFilter<"DailyChallenge"> | boolean
    createdAt?: DateTimeFilter<"DailyChallenge"> | Date | string
    answers?: DailyChallengeAnswerListRelationFilter
  }

  export type DailyChallengeOrderByWithRelationInput = {
    id?: SortOrder
    date?: SortOrder
    verse?: SortOrder
    blanks?: SortOrder
    emojiMapping?: SortOrder
    correctBook?: SortOrder
    correctRef?: SortOrder
    context?: SortOrderInput | SortOrder
    difficulty?: SortOrder
    maxAttempts?: SortOrder
    timeLimit?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    answers?: DailyChallengeAnswerOrderByRelationAggregateInput
  }

  export type DailyChallengeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    date?: Date | string
    AND?: DailyChallengeWhereInput | DailyChallengeWhereInput[]
    OR?: DailyChallengeWhereInput[]
    NOT?: DailyChallengeWhereInput | DailyChallengeWhereInput[]
    verse?: StringFilter<"DailyChallenge"> | string
    blanks?: JsonFilter<"DailyChallenge">
    emojiMapping?: JsonFilter<"DailyChallenge">
    correctBook?: StringFilter<"DailyChallenge"> | string
    correctRef?: StringFilter<"DailyChallenge"> | string
    context?: StringNullableFilter<"DailyChallenge"> | string | null
    difficulty?: StringFilter<"DailyChallenge"> | string
    maxAttempts?: IntFilter<"DailyChallenge"> | number
    timeLimit?: IntNullableFilter<"DailyChallenge"> | number | null
    isActive?: BoolFilter<"DailyChallenge"> | boolean
    createdAt?: DateTimeFilter<"DailyChallenge"> | Date | string
    answers?: DailyChallengeAnswerListRelationFilter
  }, "id" | "date">

  export type DailyChallengeOrderByWithAggregationInput = {
    id?: SortOrder
    date?: SortOrder
    verse?: SortOrder
    blanks?: SortOrder
    emojiMapping?: SortOrder
    correctBook?: SortOrder
    correctRef?: SortOrder
    context?: SortOrderInput | SortOrder
    difficulty?: SortOrder
    maxAttempts?: SortOrder
    timeLimit?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    _count?: DailyChallengeCountOrderByAggregateInput
    _avg?: DailyChallengeAvgOrderByAggregateInput
    _max?: DailyChallengeMaxOrderByAggregateInput
    _min?: DailyChallengeMinOrderByAggregateInput
    _sum?: DailyChallengeSumOrderByAggregateInput
  }

  export type DailyChallengeScalarWhereWithAggregatesInput = {
    AND?: DailyChallengeScalarWhereWithAggregatesInput | DailyChallengeScalarWhereWithAggregatesInput[]
    OR?: DailyChallengeScalarWhereWithAggregatesInput[]
    NOT?: DailyChallengeScalarWhereWithAggregatesInput | DailyChallengeScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"DailyChallenge"> | string
    date?: DateTimeWithAggregatesFilter<"DailyChallenge"> | Date | string
    verse?: StringWithAggregatesFilter<"DailyChallenge"> | string
    blanks?: JsonWithAggregatesFilter<"DailyChallenge">
    emojiMapping?: JsonWithAggregatesFilter<"DailyChallenge">
    correctBook?: StringWithAggregatesFilter<"DailyChallenge"> | string
    correctRef?: StringWithAggregatesFilter<"DailyChallenge"> | string
    context?: StringNullableWithAggregatesFilter<"DailyChallenge"> | string | null
    difficulty?: StringWithAggregatesFilter<"DailyChallenge"> | string
    maxAttempts?: IntWithAggregatesFilter<"DailyChallenge"> | number
    timeLimit?: IntNullableWithAggregatesFilter<"DailyChallenge"> | number | null
    isActive?: BoolWithAggregatesFilter<"DailyChallenge"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"DailyChallenge"> | Date | string
  }

  export type DailyChallengeAnswerWhereInput = {
    AND?: DailyChallengeAnswerWhereInput | DailyChallengeAnswerWhereInput[]
    OR?: DailyChallengeAnswerWhereInput[]
    NOT?: DailyChallengeAnswerWhereInput | DailyChallengeAnswerWhereInput[]
    id?: UuidFilter<"DailyChallengeAnswer"> | string
    challengeId?: UuidFilter<"DailyChallengeAnswer"> | string
    userId?: UuidFilter<"DailyChallengeAnswer"> | string
    userAnswers?: JsonFilter<"DailyChallengeAnswer">
    isCorrect?: BoolFilter<"DailyChallengeAnswer"> | boolean
    score?: IntFilter<"DailyChallengeAnswer"> | number
    timeSpent?: IntFilter<"DailyChallengeAnswer"> | number
    hintsUsed?: IntFilter<"DailyChallengeAnswer"> | number
    completedAt?: DateTimeFilter<"DailyChallengeAnswer"> | Date | string
    challenge?: XOR<DailyChallengeScalarRelationFilter, DailyChallengeWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type DailyChallengeAnswerOrderByWithRelationInput = {
    id?: SortOrder
    challengeId?: SortOrder
    userId?: SortOrder
    userAnswers?: SortOrder
    isCorrect?: SortOrder
    score?: SortOrder
    timeSpent?: SortOrder
    hintsUsed?: SortOrder
    completedAt?: SortOrder
    challenge?: DailyChallengeOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type DailyChallengeAnswerWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    challengeId_userId?: DailyChallengeAnswerChallengeIdUserIdCompoundUniqueInput
    AND?: DailyChallengeAnswerWhereInput | DailyChallengeAnswerWhereInput[]
    OR?: DailyChallengeAnswerWhereInput[]
    NOT?: DailyChallengeAnswerWhereInput | DailyChallengeAnswerWhereInput[]
    challengeId?: UuidFilter<"DailyChallengeAnswer"> | string
    userId?: UuidFilter<"DailyChallengeAnswer"> | string
    userAnswers?: JsonFilter<"DailyChallengeAnswer">
    isCorrect?: BoolFilter<"DailyChallengeAnswer"> | boolean
    score?: IntFilter<"DailyChallengeAnswer"> | number
    timeSpent?: IntFilter<"DailyChallengeAnswer"> | number
    hintsUsed?: IntFilter<"DailyChallengeAnswer"> | number
    completedAt?: DateTimeFilter<"DailyChallengeAnswer"> | Date | string
    challenge?: XOR<DailyChallengeScalarRelationFilter, DailyChallengeWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "challengeId_userId">

  export type DailyChallengeAnswerOrderByWithAggregationInput = {
    id?: SortOrder
    challengeId?: SortOrder
    userId?: SortOrder
    userAnswers?: SortOrder
    isCorrect?: SortOrder
    score?: SortOrder
    timeSpent?: SortOrder
    hintsUsed?: SortOrder
    completedAt?: SortOrder
    _count?: DailyChallengeAnswerCountOrderByAggregateInput
    _avg?: DailyChallengeAnswerAvgOrderByAggregateInput
    _max?: DailyChallengeAnswerMaxOrderByAggregateInput
    _min?: DailyChallengeAnswerMinOrderByAggregateInput
    _sum?: DailyChallengeAnswerSumOrderByAggregateInput
  }

  export type DailyChallengeAnswerScalarWhereWithAggregatesInput = {
    AND?: DailyChallengeAnswerScalarWhereWithAggregatesInput | DailyChallengeAnswerScalarWhereWithAggregatesInput[]
    OR?: DailyChallengeAnswerScalarWhereWithAggregatesInput[]
    NOT?: DailyChallengeAnswerScalarWhereWithAggregatesInput | DailyChallengeAnswerScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"DailyChallengeAnswer"> | string
    challengeId?: UuidWithAggregatesFilter<"DailyChallengeAnswer"> | string
    userId?: UuidWithAggregatesFilter<"DailyChallengeAnswer"> | string
    userAnswers?: JsonWithAggregatesFilter<"DailyChallengeAnswer">
    isCorrect?: BoolWithAggregatesFilter<"DailyChallengeAnswer"> | boolean
    score?: IntWithAggregatesFilter<"DailyChallengeAnswer"> | number
    timeSpent?: IntWithAggregatesFilter<"DailyChallengeAnswer"> | number
    hintsUsed?: IntWithAggregatesFilter<"DailyChallengeAnswer"> | number
    completedAt?: DateTimeWithAggregatesFilter<"DailyChallengeAnswer"> | Date | string
  }

  export type LeaderboardWhereInput = {
    AND?: LeaderboardWhereInput | LeaderboardWhereInput[]
    OR?: LeaderboardWhereInput[]
    NOT?: LeaderboardWhereInput | LeaderboardWhereInput[]
    id?: UuidFilter<"Leaderboard"> | string
    userId?: UuidFilter<"Leaderboard"> | string
    globalRank?: IntFilter<"Leaderboard"> | number
    weeklyRank?: IntNullableFilter<"Leaderboard"> | number | null
    monthlyRank?: IntNullableFilter<"Leaderboard"> | number | null
    totalScore?: IntFilter<"Leaderboard"> | number
    gamesPlayed?: IntFilter<"Leaderboard"> | number
    gamesWon?: IntFilter<"Leaderboard"> | number
    winRate?: FloatFilter<"Leaderboard"> | number
    currentStreak?: IntFilter<"Leaderboard"> | number
    bestStreak?: IntFilter<"Leaderboard"> | number
    lastUpdated?: DateTimeFilter<"Leaderboard"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type LeaderboardOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    globalRank?: SortOrder
    weeklyRank?: SortOrderInput | SortOrder
    monthlyRank?: SortOrderInput | SortOrder
    totalScore?: SortOrder
    gamesPlayed?: SortOrder
    gamesWon?: SortOrder
    winRate?: SortOrder
    currentStreak?: SortOrder
    bestStreak?: SortOrder
    lastUpdated?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type LeaderboardWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: LeaderboardWhereInput | LeaderboardWhereInput[]
    OR?: LeaderboardWhereInput[]
    NOT?: LeaderboardWhereInput | LeaderboardWhereInput[]
    globalRank?: IntFilter<"Leaderboard"> | number
    weeklyRank?: IntNullableFilter<"Leaderboard"> | number | null
    monthlyRank?: IntNullableFilter<"Leaderboard"> | number | null
    totalScore?: IntFilter<"Leaderboard"> | number
    gamesPlayed?: IntFilter<"Leaderboard"> | number
    gamesWon?: IntFilter<"Leaderboard"> | number
    winRate?: FloatFilter<"Leaderboard"> | number
    currentStreak?: IntFilter<"Leaderboard"> | number
    bestStreak?: IntFilter<"Leaderboard"> | number
    lastUpdated?: DateTimeFilter<"Leaderboard"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId">

  export type LeaderboardOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    globalRank?: SortOrder
    weeklyRank?: SortOrderInput | SortOrder
    monthlyRank?: SortOrderInput | SortOrder
    totalScore?: SortOrder
    gamesPlayed?: SortOrder
    gamesWon?: SortOrder
    winRate?: SortOrder
    currentStreak?: SortOrder
    bestStreak?: SortOrder
    lastUpdated?: SortOrder
    _count?: LeaderboardCountOrderByAggregateInput
    _avg?: LeaderboardAvgOrderByAggregateInput
    _max?: LeaderboardMaxOrderByAggregateInput
    _min?: LeaderboardMinOrderByAggregateInput
    _sum?: LeaderboardSumOrderByAggregateInput
  }

  export type LeaderboardScalarWhereWithAggregatesInput = {
    AND?: LeaderboardScalarWhereWithAggregatesInput | LeaderboardScalarWhereWithAggregatesInput[]
    OR?: LeaderboardScalarWhereWithAggregatesInput[]
    NOT?: LeaderboardScalarWhereWithAggregatesInput | LeaderboardScalarWhereWithAggregatesInput[]
    id?: UuidWithAggregatesFilter<"Leaderboard"> | string
    userId?: UuidWithAggregatesFilter<"Leaderboard"> | string
    globalRank?: IntWithAggregatesFilter<"Leaderboard"> | number
    weeklyRank?: IntNullableWithAggregatesFilter<"Leaderboard"> | number | null
    monthlyRank?: IntNullableWithAggregatesFilter<"Leaderboard"> | number | null
    totalScore?: IntWithAggregatesFilter<"Leaderboard"> | number
    gamesPlayed?: IntWithAggregatesFilter<"Leaderboard"> | number
    gamesWon?: IntWithAggregatesFilter<"Leaderboard"> | number
    winRate?: FloatWithAggregatesFilter<"Leaderboard"> | number
    currentStreak?: IntWithAggregatesFilter<"Leaderboard"> | number
    bestStreak?: IntWithAggregatesFilter<"Leaderboard"> | number
    lastUpdated?: DateTimeWithAggregatesFilter<"Leaderboard"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    username: string
    firstName: string
    lastName: string
    phone?: string | null
    avatar?: string | null
    status?: $Enums.UserStatus
    totalScore?: number
    gamesPlayed?: number
    gamesWon?: number
    winRate?: number
    currentStreak?: number
    bestStreak?: number
    lastActive?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: UserSessionCreateNestedManyWithoutUserInput
    passwordResetTokens?: PasswordResetTokenCreateNestedManyWithoutUserInput
    sentFriendRequests?: FriendshipCreateNestedManyWithoutRequesterInput
    receivedFriendRequests?: FriendshipCreateNestedManyWithoutReceiverInput
    gameParticipations?: GameParticipantCreateNestedManyWithoutUserInput
    dailyChallengeAnswers?: DailyChallengeAnswerCreateNestedManyWithoutUserInput
    leaderboardEntry?: LeaderboardCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    username: string
    firstName: string
    lastName: string
    phone?: string | null
    avatar?: string | null
    status?: $Enums.UserStatus
    totalScore?: number
    gamesPlayed?: number
    gamesWon?: number
    winRate?: number
    currentStreak?: number
    bestStreak?: number
    lastActive?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: UserSessionUncheckedCreateNestedManyWithoutUserInput
    passwordResetTokens?: PasswordResetTokenUncheckedCreateNestedManyWithoutUserInput
    sentFriendRequests?: FriendshipUncheckedCreateNestedManyWithoutRequesterInput
    receivedFriendRequests?: FriendshipUncheckedCreateNestedManyWithoutReceiverInput
    gameParticipations?: GameParticipantUncheckedCreateNestedManyWithoutUserInput
    dailyChallengeAnswers?: DailyChallengeAnswerUncheckedCreateNestedManyWithoutUserInput
    leaderboardEntry?: LeaderboardUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    totalScore?: IntFieldUpdateOperationsInput | number
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    gamesWon?: IntFieldUpdateOperationsInput | number
    winRate?: FloatFieldUpdateOperationsInput | number
    currentStreak?: IntFieldUpdateOperationsInput | number
    bestStreak?: IntFieldUpdateOperationsInput | number
    lastActive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: UserSessionUpdateManyWithoutUserNestedInput
    passwordResetTokens?: PasswordResetTokenUpdateManyWithoutUserNestedInput
    sentFriendRequests?: FriendshipUpdateManyWithoutRequesterNestedInput
    receivedFriendRequests?: FriendshipUpdateManyWithoutReceiverNestedInput
    gameParticipations?: GameParticipantUpdateManyWithoutUserNestedInput
    dailyChallengeAnswers?: DailyChallengeAnswerUpdateManyWithoutUserNestedInput
    leaderboardEntry?: LeaderboardUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    totalScore?: IntFieldUpdateOperationsInput | number
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    gamesWon?: IntFieldUpdateOperationsInput | number
    winRate?: FloatFieldUpdateOperationsInput | number
    currentStreak?: IntFieldUpdateOperationsInput | number
    bestStreak?: IntFieldUpdateOperationsInput | number
    lastActive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: UserSessionUncheckedUpdateManyWithoutUserNestedInput
    passwordResetTokens?: PasswordResetTokenUncheckedUpdateManyWithoutUserNestedInput
    sentFriendRequests?: FriendshipUncheckedUpdateManyWithoutRequesterNestedInput
    receivedFriendRequests?: FriendshipUncheckedUpdateManyWithoutReceiverNestedInput
    gameParticipations?: GameParticipantUncheckedUpdateManyWithoutUserNestedInput
    dailyChallengeAnswers?: DailyChallengeAnswerUncheckedUpdateManyWithoutUserNestedInput
    leaderboardEntry?: LeaderboardUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    username: string
    firstName: string
    lastName: string
    phone?: string | null
    avatar?: string | null
    status?: $Enums.UserStatus
    totalScore?: number
    gamesPlayed?: number
    gamesWon?: number
    winRate?: number
    currentStreak?: number
    bestStreak?: number
    lastActive?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    totalScore?: IntFieldUpdateOperationsInput | number
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    gamesWon?: IntFieldUpdateOperationsInput | number
    winRate?: FloatFieldUpdateOperationsInput | number
    currentStreak?: IntFieldUpdateOperationsInput | number
    bestStreak?: IntFieldUpdateOperationsInput | number
    lastActive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    totalScore?: IntFieldUpdateOperationsInput | number
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    gamesWon?: IntFieldUpdateOperationsInput | number
    winRate?: FloatFieldUpdateOperationsInput | number
    currentStreak?: IntFieldUpdateOperationsInput | number
    bestStreak?: IntFieldUpdateOperationsInput | number
    lastActive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetTokenCreateInput = {
    id?: string
    token: string
    expiresAt: Date | string
    used?: boolean
    createdAt?: Date | string
    usedAt?: Date | string | null
    user: UserCreateNestedOneWithoutPasswordResetTokensInput
  }

  export type PasswordResetTokenUncheckedCreateInput = {
    id?: string
    userId: string
    token: string
    expiresAt: Date | string
    used?: boolean
    createdAt?: Date | string
    usedAt?: Date | string | null
  }

  export type PasswordResetTokenUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    used?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutPasswordResetTokensNestedInput
  }

  export type PasswordResetTokenUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    used?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PasswordResetTokenCreateManyInput = {
    id?: string
    userId: string
    token: string
    expiresAt: Date | string
    used?: boolean
    createdAt?: Date | string
    usedAt?: Date | string | null
  }

  export type PasswordResetTokenUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    used?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PasswordResetTokenUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    used?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserSessionCreateInput = {
    id?: string
    sessionToken: string
    deviceInfo?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    userAgent?: string | null
    status?: $Enums.SessionStatus
    createdAt?: Date | string
    expiresAt: Date | string
    lastActivity?: Date | string
    user: UserCreateNestedOneWithoutSessionsInput
  }

  export type UserSessionUncheckedCreateInput = {
    id?: string
    userId: string
    sessionToken: string
    deviceInfo?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    userAgent?: string | null
    status?: $Enums.SessionStatus
    createdAt?: Date | string
    expiresAt: Date | string
    lastActivity?: Date | string
  }

  export type UserSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    deviceInfo?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActivity?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type UserSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    deviceInfo?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActivity?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSessionCreateManyInput = {
    id?: string
    userId: string
    sessionToken: string
    deviceInfo?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    userAgent?: string | null
    status?: $Enums.SessionStatus
    createdAt?: Date | string
    expiresAt: Date | string
    lastActivity?: Date | string
  }

  export type UserSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    deviceInfo?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActivity?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    deviceInfo?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActivity?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FriendshipCreateInput = {
    id?: string
    status?: $Enums.FriendshipStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    requester: UserCreateNestedOneWithoutSentFriendRequestsInput
    receiver: UserCreateNestedOneWithoutReceivedFriendRequestsInput
  }

  export type FriendshipUncheckedCreateInput = {
    id?: string
    requesterId: string
    receiverId: string
    status?: $Enums.FriendshipStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FriendshipUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendshipStatusFieldUpdateOperationsInput | $Enums.FriendshipStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requester?: UserUpdateOneRequiredWithoutSentFriendRequestsNestedInput
    receiver?: UserUpdateOneRequiredWithoutReceivedFriendRequestsNestedInput
  }

  export type FriendshipUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    requesterId?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendshipStatusFieldUpdateOperationsInput | $Enums.FriendshipStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FriendshipCreateManyInput = {
    id?: string
    requesterId: string
    receiverId: string
    status?: $Enums.FriendshipStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FriendshipUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendshipStatusFieldUpdateOperationsInput | $Enums.FriendshipStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FriendshipUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    requesterId?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendshipStatusFieldUpdateOperationsInput | $Enums.FriendshipStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameSessionCreateInput = {
    id?: string
    roomCode?: string | null
    gameType: $Enums.GameType
    status?: $Enums.GameStatus
    maxPlayers?: number
    currentRound?: number
    totalRounds?: number
    maxMistakes?: number
    difficulty?: string
    timeLimit?: number | null
    createdAt?: Date | string
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    updatedAt?: Date | string
    participants?: GameParticipantCreateNestedManyWithoutGameSessionInput
    rounds?: GameRoundCreateNestedManyWithoutGameSessionInput
  }

  export type GameSessionUncheckedCreateInput = {
    id?: string
    roomCode?: string | null
    gameType: $Enums.GameType
    status?: $Enums.GameStatus
    maxPlayers?: number
    currentRound?: number
    totalRounds?: number
    maxMistakes?: number
    difficulty?: string
    timeLimit?: number | null
    createdAt?: Date | string
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    updatedAt?: Date | string
    participants?: GameParticipantUncheckedCreateNestedManyWithoutGameSessionInput
    rounds?: GameRoundUncheckedCreateNestedManyWithoutGameSessionInput
  }

  export type GameSessionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomCode?: NullableStringFieldUpdateOperationsInput | string | null
    gameType?: EnumGameTypeFieldUpdateOperationsInput | $Enums.GameType
    status?: EnumGameStatusFieldUpdateOperationsInput | $Enums.GameStatus
    maxPlayers?: IntFieldUpdateOperationsInput | number
    currentRound?: IntFieldUpdateOperationsInput | number
    totalRounds?: IntFieldUpdateOperationsInput | number
    maxMistakes?: IntFieldUpdateOperationsInput | number
    difficulty?: StringFieldUpdateOperationsInput | string
    timeLimit?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: GameParticipantUpdateManyWithoutGameSessionNestedInput
    rounds?: GameRoundUpdateManyWithoutGameSessionNestedInput
  }

  export type GameSessionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomCode?: NullableStringFieldUpdateOperationsInput | string | null
    gameType?: EnumGameTypeFieldUpdateOperationsInput | $Enums.GameType
    status?: EnumGameStatusFieldUpdateOperationsInput | $Enums.GameStatus
    maxPlayers?: IntFieldUpdateOperationsInput | number
    currentRound?: IntFieldUpdateOperationsInput | number
    totalRounds?: IntFieldUpdateOperationsInput | number
    maxMistakes?: IntFieldUpdateOperationsInput | number
    difficulty?: StringFieldUpdateOperationsInput | string
    timeLimit?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: GameParticipantUncheckedUpdateManyWithoutGameSessionNestedInput
    rounds?: GameRoundUncheckedUpdateManyWithoutGameSessionNestedInput
  }

  export type GameSessionCreateManyInput = {
    id?: string
    roomCode?: string | null
    gameType: $Enums.GameType
    status?: $Enums.GameStatus
    maxPlayers?: number
    currentRound?: number
    totalRounds?: number
    maxMistakes?: number
    difficulty?: string
    timeLimit?: number | null
    createdAt?: Date | string
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    updatedAt?: Date | string
  }

  export type GameSessionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomCode?: NullableStringFieldUpdateOperationsInput | string | null
    gameType?: EnumGameTypeFieldUpdateOperationsInput | $Enums.GameType
    status?: EnumGameStatusFieldUpdateOperationsInput | $Enums.GameStatus
    maxPlayers?: IntFieldUpdateOperationsInput | number
    currentRound?: IntFieldUpdateOperationsInput | number
    totalRounds?: IntFieldUpdateOperationsInput | number
    maxMistakes?: IntFieldUpdateOperationsInput | number
    difficulty?: StringFieldUpdateOperationsInput | string
    timeLimit?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameSessionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomCode?: NullableStringFieldUpdateOperationsInput | string | null
    gameType?: EnumGameTypeFieldUpdateOperationsInput | $Enums.GameType
    status?: EnumGameStatusFieldUpdateOperationsInput | $Enums.GameStatus
    maxPlayers?: IntFieldUpdateOperationsInput | number
    currentRound?: IntFieldUpdateOperationsInput | number
    totalRounds?: IntFieldUpdateOperationsInput | number
    maxMistakes?: IntFieldUpdateOperationsInput | number
    difficulty?: StringFieldUpdateOperationsInput | string
    timeLimit?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameParticipantCreateInput = {
    id?: string
    position?: number
    isReady?: boolean
    isConnected?: boolean
    finalScore?: number
    finalRank?: number | null
    mistakeCount?: number
    joinedAt?: Date | string
    leftAt?: Date | string | null
    gameSession: GameSessionCreateNestedOneWithoutParticipantsInput
    user: UserCreateNestedOneWithoutGameParticipationsInput
    scores?: GameScoreCreateNestedManyWithoutParticipantInput
  }

  export type GameParticipantUncheckedCreateInput = {
    id?: string
    gameSessionId: string
    userId: string
    position?: number
    isReady?: boolean
    isConnected?: boolean
    finalScore?: number
    finalRank?: number | null
    mistakeCount?: number
    joinedAt?: Date | string
    leftAt?: Date | string | null
    scores?: GameScoreUncheckedCreateNestedManyWithoutParticipantInput
  }

  export type GameParticipantUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    isReady?: BoolFieldUpdateOperationsInput | boolean
    isConnected?: BoolFieldUpdateOperationsInput | boolean
    finalScore?: IntFieldUpdateOperationsInput | number
    finalRank?: NullableIntFieldUpdateOperationsInput | number | null
    mistakeCount?: IntFieldUpdateOperationsInput | number
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gameSession?: GameSessionUpdateOneRequiredWithoutParticipantsNestedInput
    user?: UserUpdateOneRequiredWithoutGameParticipationsNestedInput
    scores?: GameScoreUpdateManyWithoutParticipantNestedInput
  }

  export type GameParticipantUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    gameSessionId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    isReady?: BoolFieldUpdateOperationsInput | boolean
    isConnected?: BoolFieldUpdateOperationsInput | boolean
    finalScore?: IntFieldUpdateOperationsInput | number
    finalRank?: NullableIntFieldUpdateOperationsInput | number | null
    mistakeCount?: IntFieldUpdateOperationsInput | number
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scores?: GameScoreUncheckedUpdateManyWithoutParticipantNestedInput
  }

  export type GameParticipantCreateManyInput = {
    id?: string
    gameSessionId: string
    userId: string
    position?: number
    isReady?: boolean
    isConnected?: boolean
    finalScore?: number
    finalRank?: number | null
    mistakeCount?: number
    joinedAt?: Date | string
    leftAt?: Date | string | null
  }

  export type GameParticipantUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    isReady?: BoolFieldUpdateOperationsInput | boolean
    isConnected?: BoolFieldUpdateOperationsInput | boolean
    finalScore?: IntFieldUpdateOperationsInput | number
    finalRank?: NullableIntFieldUpdateOperationsInput | number | null
    mistakeCount?: IntFieldUpdateOperationsInput | number
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GameParticipantUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    gameSessionId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    isReady?: BoolFieldUpdateOperationsInput | boolean
    isConnected?: BoolFieldUpdateOperationsInput | boolean
    finalScore?: IntFieldUpdateOperationsInput | number
    finalRank?: NullableIntFieldUpdateOperationsInput | number | null
    mistakeCount?: IntFieldUpdateOperationsInput | number
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GameRoundCreateInput = {
    id?: string
    roundNumber: number
    verse: string
    blanks: JsonNullValueInput | InputJsonValue
    emojiMapping: JsonNullValueInput | InputJsonValue
    correctBook: string
    correctRef: string
    context?: string | null
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    gameSession: GameSessionCreateNestedOneWithoutRoundsInput
    scores?: GameScoreCreateNestedManyWithoutRoundInput
  }

  export type GameRoundUncheckedCreateInput = {
    id?: string
    gameSessionId: string
    roundNumber: number
    verse: string
    blanks: JsonNullValueInput | InputJsonValue
    emojiMapping: JsonNullValueInput | InputJsonValue
    correctBook: string
    correctRef: string
    context?: string | null
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    scores?: GameScoreUncheckedCreateNestedManyWithoutRoundInput
  }

  export type GameRoundUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    roundNumber?: IntFieldUpdateOperationsInput | number
    verse?: StringFieldUpdateOperationsInput | string
    blanks?: JsonNullValueInput | InputJsonValue
    emojiMapping?: JsonNullValueInput | InputJsonValue
    correctBook?: StringFieldUpdateOperationsInput | string
    correctRef?: StringFieldUpdateOperationsInput | string
    context?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gameSession?: GameSessionUpdateOneRequiredWithoutRoundsNestedInput
    scores?: GameScoreUpdateManyWithoutRoundNestedInput
  }

  export type GameRoundUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    gameSessionId?: StringFieldUpdateOperationsInput | string
    roundNumber?: IntFieldUpdateOperationsInput | number
    verse?: StringFieldUpdateOperationsInput | string
    blanks?: JsonNullValueInput | InputJsonValue
    emojiMapping?: JsonNullValueInput | InputJsonValue
    correctBook?: StringFieldUpdateOperationsInput | string
    correctRef?: StringFieldUpdateOperationsInput | string
    context?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scores?: GameScoreUncheckedUpdateManyWithoutRoundNestedInput
  }

  export type GameRoundCreateManyInput = {
    id?: string
    gameSessionId: string
    roundNumber: number
    verse: string
    blanks: JsonNullValueInput | InputJsonValue
    emojiMapping: JsonNullValueInput | InputJsonValue
    correctBook: string
    correctRef: string
    context?: string | null
    startedAt?: Date | string | null
    endedAt?: Date | string | null
  }

  export type GameRoundUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    roundNumber?: IntFieldUpdateOperationsInput | number
    verse?: StringFieldUpdateOperationsInput | string
    blanks?: JsonNullValueInput | InputJsonValue
    emojiMapping?: JsonNullValueInput | InputJsonValue
    correctBook?: StringFieldUpdateOperationsInput | string
    correctRef?: StringFieldUpdateOperationsInput | string
    context?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GameRoundUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    gameSessionId?: StringFieldUpdateOperationsInput | string
    roundNumber?: IntFieldUpdateOperationsInput | number
    verse?: StringFieldUpdateOperationsInput | string
    blanks?: JsonNullValueInput | InputJsonValue
    emojiMapping?: JsonNullValueInput | InputJsonValue
    correctBook?: StringFieldUpdateOperationsInput | string
    correctRef?: StringFieldUpdateOperationsInput | string
    context?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GameScoreCreateInput = {
    id?: string
    blanksScore?: number
    contextScore?: number
    bookScore?: number
    referenceScore?: number
    timeBonus?: number
    streakBonus?: number
    totalScore?: number
    timeSpent: number
    mistakesMade?: number
    hintsUsed?: number
    createdAt?: Date | string
    participant: GameParticipantCreateNestedOneWithoutScoresInput
    round: GameRoundCreateNestedOneWithoutScoresInput
  }

  export type GameScoreUncheckedCreateInput = {
    id?: string
    participantId: string
    roundId: string
    blanksScore?: number
    contextScore?: number
    bookScore?: number
    referenceScore?: number
    timeBonus?: number
    streakBonus?: number
    totalScore?: number
    timeSpent: number
    mistakesMade?: number
    hintsUsed?: number
    createdAt?: Date | string
  }

  export type GameScoreUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    blanksScore?: IntFieldUpdateOperationsInput | number
    contextScore?: IntFieldUpdateOperationsInput | number
    bookScore?: IntFieldUpdateOperationsInput | number
    referenceScore?: IntFieldUpdateOperationsInput | number
    timeBonus?: IntFieldUpdateOperationsInput | number
    streakBonus?: IntFieldUpdateOperationsInput | number
    totalScore?: IntFieldUpdateOperationsInput | number
    timeSpent?: IntFieldUpdateOperationsInput | number
    mistakesMade?: IntFieldUpdateOperationsInput | number
    hintsUsed?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participant?: GameParticipantUpdateOneRequiredWithoutScoresNestedInput
    round?: GameRoundUpdateOneRequiredWithoutScoresNestedInput
  }

  export type GameScoreUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    participantId?: StringFieldUpdateOperationsInput | string
    roundId?: StringFieldUpdateOperationsInput | string
    blanksScore?: IntFieldUpdateOperationsInput | number
    contextScore?: IntFieldUpdateOperationsInput | number
    bookScore?: IntFieldUpdateOperationsInput | number
    referenceScore?: IntFieldUpdateOperationsInput | number
    timeBonus?: IntFieldUpdateOperationsInput | number
    streakBonus?: IntFieldUpdateOperationsInput | number
    totalScore?: IntFieldUpdateOperationsInput | number
    timeSpent?: IntFieldUpdateOperationsInput | number
    mistakesMade?: IntFieldUpdateOperationsInput | number
    hintsUsed?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameScoreCreateManyInput = {
    id?: string
    participantId: string
    roundId: string
    blanksScore?: number
    contextScore?: number
    bookScore?: number
    referenceScore?: number
    timeBonus?: number
    streakBonus?: number
    totalScore?: number
    timeSpent: number
    mistakesMade?: number
    hintsUsed?: number
    createdAt?: Date | string
  }

  export type GameScoreUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    blanksScore?: IntFieldUpdateOperationsInput | number
    contextScore?: IntFieldUpdateOperationsInput | number
    bookScore?: IntFieldUpdateOperationsInput | number
    referenceScore?: IntFieldUpdateOperationsInput | number
    timeBonus?: IntFieldUpdateOperationsInput | number
    streakBonus?: IntFieldUpdateOperationsInput | number
    totalScore?: IntFieldUpdateOperationsInput | number
    timeSpent?: IntFieldUpdateOperationsInput | number
    mistakesMade?: IntFieldUpdateOperationsInput | number
    hintsUsed?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameScoreUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    participantId?: StringFieldUpdateOperationsInput | string
    roundId?: StringFieldUpdateOperationsInput | string
    blanksScore?: IntFieldUpdateOperationsInput | number
    contextScore?: IntFieldUpdateOperationsInput | number
    bookScore?: IntFieldUpdateOperationsInput | number
    referenceScore?: IntFieldUpdateOperationsInput | number
    timeBonus?: IntFieldUpdateOperationsInput | number
    streakBonus?: IntFieldUpdateOperationsInput | number
    totalScore?: IntFieldUpdateOperationsInput | number
    timeSpent?: IntFieldUpdateOperationsInput | number
    mistakesMade?: IntFieldUpdateOperationsInput | number
    hintsUsed?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DailyChallengeCreateInput = {
    id?: string
    date: Date | string
    verse: string
    blanks: JsonNullValueInput | InputJsonValue
    emojiMapping: JsonNullValueInput | InputJsonValue
    correctBook: string
    correctRef: string
    context?: string | null
    difficulty?: string
    maxAttempts?: number
    timeLimit?: number | null
    isActive?: boolean
    createdAt?: Date | string
    answers?: DailyChallengeAnswerCreateNestedManyWithoutChallengeInput
  }

  export type DailyChallengeUncheckedCreateInput = {
    id?: string
    date: Date | string
    verse: string
    blanks: JsonNullValueInput | InputJsonValue
    emojiMapping: JsonNullValueInput | InputJsonValue
    correctBook: string
    correctRef: string
    context?: string | null
    difficulty?: string
    maxAttempts?: number
    timeLimit?: number | null
    isActive?: boolean
    createdAt?: Date | string
    answers?: DailyChallengeAnswerUncheckedCreateNestedManyWithoutChallengeInput
  }

  export type DailyChallengeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    verse?: StringFieldUpdateOperationsInput | string
    blanks?: JsonNullValueInput | InputJsonValue
    emojiMapping?: JsonNullValueInput | InputJsonValue
    correctBook?: StringFieldUpdateOperationsInput | string
    correctRef?: StringFieldUpdateOperationsInput | string
    context?: NullableStringFieldUpdateOperationsInput | string | null
    difficulty?: StringFieldUpdateOperationsInput | string
    maxAttempts?: IntFieldUpdateOperationsInput | number
    timeLimit?: NullableIntFieldUpdateOperationsInput | number | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    answers?: DailyChallengeAnswerUpdateManyWithoutChallengeNestedInput
  }

  export type DailyChallengeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    verse?: StringFieldUpdateOperationsInput | string
    blanks?: JsonNullValueInput | InputJsonValue
    emojiMapping?: JsonNullValueInput | InputJsonValue
    correctBook?: StringFieldUpdateOperationsInput | string
    correctRef?: StringFieldUpdateOperationsInput | string
    context?: NullableStringFieldUpdateOperationsInput | string | null
    difficulty?: StringFieldUpdateOperationsInput | string
    maxAttempts?: IntFieldUpdateOperationsInput | number
    timeLimit?: NullableIntFieldUpdateOperationsInput | number | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    answers?: DailyChallengeAnswerUncheckedUpdateManyWithoutChallengeNestedInput
  }

  export type DailyChallengeCreateManyInput = {
    id?: string
    date: Date | string
    verse: string
    blanks: JsonNullValueInput | InputJsonValue
    emojiMapping: JsonNullValueInput | InputJsonValue
    correctBook: string
    correctRef: string
    context?: string | null
    difficulty?: string
    maxAttempts?: number
    timeLimit?: number | null
    isActive?: boolean
    createdAt?: Date | string
  }

  export type DailyChallengeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    verse?: StringFieldUpdateOperationsInput | string
    blanks?: JsonNullValueInput | InputJsonValue
    emojiMapping?: JsonNullValueInput | InputJsonValue
    correctBook?: StringFieldUpdateOperationsInput | string
    correctRef?: StringFieldUpdateOperationsInput | string
    context?: NullableStringFieldUpdateOperationsInput | string | null
    difficulty?: StringFieldUpdateOperationsInput | string
    maxAttempts?: IntFieldUpdateOperationsInput | number
    timeLimit?: NullableIntFieldUpdateOperationsInput | number | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DailyChallengeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    verse?: StringFieldUpdateOperationsInput | string
    blanks?: JsonNullValueInput | InputJsonValue
    emojiMapping?: JsonNullValueInput | InputJsonValue
    correctBook?: StringFieldUpdateOperationsInput | string
    correctRef?: StringFieldUpdateOperationsInput | string
    context?: NullableStringFieldUpdateOperationsInput | string | null
    difficulty?: StringFieldUpdateOperationsInput | string
    maxAttempts?: IntFieldUpdateOperationsInput | number
    timeLimit?: NullableIntFieldUpdateOperationsInput | number | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DailyChallengeAnswerCreateInput = {
    id?: string
    userAnswers: JsonNullValueInput | InputJsonValue
    isCorrect?: boolean
    score?: number
    timeSpent: number
    hintsUsed?: number
    completedAt?: Date | string
    challenge: DailyChallengeCreateNestedOneWithoutAnswersInput
    user: UserCreateNestedOneWithoutDailyChallengeAnswersInput
  }

  export type DailyChallengeAnswerUncheckedCreateInput = {
    id?: string
    challengeId: string
    userId: string
    userAnswers: JsonNullValueInput | InputJsonValue
    isCorrect?: boolean
    score?: number
    timeSpent: number
    hintsUsed?: number
    completedAt?: Date | string
  }

  export type DailyChallengeAnswerUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userAnswers?: JsonNullValueInput | InputJsonValue
    isCorrect?: BoolFieldUpdateOperationsInput | boolean
    score?: IntFieldUpdateOperationsInput | number
    timeSpent?: IntFieldUpdateOperationsInput | number
    hintsUsed?: IntFieldUpdateOperationsInput | number
    completedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    challenge?: DailyChallengeUpdateOneRequiredWithoutAnswersNestedInput
    user?: UserUpdateOneRequiredWithoutDailyChallengeAnswersNestedInput
  }

  export type DailyChallengeAnswerUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    challengeId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userAnswers?: JsonNullValueInput | InputJsonValue
    isCorrect?: BoolFieldUpdateOperationsInput | boolean
    score?: IntFieldUpdateOperationsInput | number
    timeSpent?: IntFieldUpdateOperationsInput | number
    hintsUsed?: IntFieldUpdateOperationsInput | number
    completedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DailyChallengeAnswerCreateManyInput = {
    id?: string
    challengeId: string
    userId: string
    userAnswers: JsonNullValueInput | InputJsonValue
    isCorrect?: boolean
    score?: number
    timeSpent: number
    hintsUsed?: number
    completedAt?: Date | string
  }

  export type DailyChallengeAnswerUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userAnswers?: JsonNullValueInput | InputJsonValue
    isCorrect?: BoolFieldUpdateOperationsInput | boolean
    score?: IntFieldUpdateOperationsInput | number
    timeSpent?: IntFieldUpdateOperationsInput | number
    hintsUsed?: IntFieldUpdateOperationsInput | number
    completedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DailyChallengeAnswerUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    challengeId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userAnswers?: JsonNullValueInput | InputJsonValue
    isCorrect?: BoolFieldUpdateOperationsInput | boolean
    score?: IntFieldUpdateOperationsInput | number
    timeSpent?: IntFieldUpdateOperationsInput | number
    hintsUsed?: IntFieldUpdateOperationsInput | number
    completedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LeaderboardCreateInput = {
    id?: string
    globalRank: number
    weeklyRank?: number | null
    monthlyRank?: number | null
    totalScore: number
    gamesPlayed: number
    gamesWon: number
    winRate: number
    currentStreak: number
    bestStreak: number
    lastUpdated?: Date | string
    user: UserCreateNestedOneWithoutLeaderboardEntryInput
  }

  export type LeaderboardUncheckedCreateInput = {
    id?: string
    userId: string
    globalRank: number
    weeklyRank?: number | null
    monthlyRank?: number | null
    totalScore: number
    gamesPlayed: number
    gamesWon: number
    winRate: number
    currentStreak: number
    bestStreak: number
    lastUpdated?: Date | string
  }

  export type LeaderboardUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    globalRank?: IntFieldUpdateOperationsInput | number
    weeklyRank?: NullableIntFieldUpdateOperationsInput | number | null
    monthlyRank?: NullableIntFieldUpdateOperationsInput | number | null
    totalScore?: IntFieldUpdateOperationsInput | number
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    gamesWon?: IntFieldUpdateOperationsInput | number
    winRate?: FloatFieldUpdateOperationsInput | number
    currentStreak?: IntFieldUpdateOperationsInput | number
    bestStreak?: IntFieldUpdateOperationsInput | number
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutLeaderboardEntryNestedInput
  }

  export type LeaderboardUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    globalRank?: IntFieldUpdateOperationsInput | number
    weeklyRank?: NullableIntFieldUpdateOperationsInput | number | null
    monthlyRank?: NullableIntFieldUpdateOperationsInput | number | null
    totalScore?: IntFieldUpdateOperationsInput | number
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    gamesWon?: IntFieldUpdateOperationsInput | number
    winRate?: FloatFieldUpdateOperationsInput | number
    currentStreak?: IntFieldUpdateOperationsInput | number
    bestStreak?: IntFieldUpdateOperationsInput | number
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LeaderboardCreateManyInput = {
    id?: string
    userId: string
    globalRank: number
    weeklyRank?: number | null
    monthlyRank?: number | null
    totalScore: number
    gamesPlayed: number
    gamesWon: number
    winRate: number
    currentStreak: number
    bestStreak: number
    lastUpdated?: Date | string
  }

  export type LeaderboardUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    globalRank?: IntFieldUpdateOperationsInput | number
    weeklyRank?: NullableIntFieldUpdateOperationsInput | number | null
    monthlyRank?: NullableIntFieldUpdateOperationsInput | number | null
    totalScore?: IntFieldUpdateOperationsInput | number
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    gamesWon?: IntFieldUpdateOperationsInput | number
    winRate?: FloatFieldUpdateOperationsInput | number
    currentStreak?: IntFieldUpdateOperationsInput | number
    bestStreak?: IntFieldUpdateOperationsInput | number
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LeaderboardUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    globalRank?: IntFieldUpdateOperationsInput | number
    weeklyRank?: NullableIntFieldUpdateOperationsInput | number | null
    monthlyRank?: NullableIntFieldUpdateOperationsInput | number | null
    totalScore?: IntFieldUpdateOperationsInput | number
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    gamesWon?: IntFieldUpdateOperationsInput | number
    winRate?: FloatFieldUpdateOperationsInput | number
    currentStreak?: IntFieldUpdateOperationsInput | number
    bestStreak?: IntFieldUpdateOperationsInput | number
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumUserStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.UserStatus | EnumUserStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUserStatusFilter<$PrismaModel> | $Enums.UserStatus
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type UserSessionListRelationFilter = {
    every?: UserSessionWhereInput
    some?: UserSessionWhereInput
    none?: UserSessionWhereInput
  }

  export type PasswordResetTokenListRelationFilter = {
    every?: PasswordResetTokenWhereInput
    some?: PasswordResetTokenWhereInput
    none?: PasswordResetTokenWhereInput
  }

  export type FriendshipListRelationFilter = {
    every?: FriendshipWhereInput
    some?: FriendshipWhereInput
    none?: FriendshipWhereInput
  }

  export type GameParticipantListRelationFilter = {
    every?: GameParticipantWhereInput
    some?: GameParticipantWhereInput
    none?: GameParticipantWhereInput
  }

  export type DailyChallengeAnswerListRelationFilter = {
    every?: DailyChallengeAnswerWhereInput
    some?: DailyChallengeAnswerWhereInput
    none?: DailyChallengeAnswerWhereInput
  }

  export type LeaderboardNullableScalarRelationFilter = {
    is?: LeaderboardWhereInput | null
    isNot?: LeaderboardWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type UserSessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PasswordResetTokenOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type FriendshipOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GameParticipantOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DailyChallengeAnswerOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    phone?: SortOrder
    avatar?: SortOrder
    status?: SortOrder
    totalScore?: SortOrder
    gamesPlayed?: SortOrder
    gamesWon?: SortOrder
    winRate?: SortOrder
    currentStreak?: SortOrder
    bestStreak?: SortOrder
    lastActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    totalScore?: SortOrder
    gamesPlayed?: SortOrder
    gamesWon?: SortOrder
    winRate?: SortOrder
    currentStreak?: SortOrder
    bestStreak?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    phone?: SortOrder
    avatar?: SortOrder
    status?: SortOrder
    totalScore?: SortOrder
    gamesPlayed?: SortOrder
    gamesWon?: SortOrder
    winRate?: SortOrder
    currentStreak?: SortOrder
    bestStreak?: SortOrder
    lastActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    username?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    phone?: SortOrder
    avatar?: SortOrder
    status?: SortOrder
    totalScore?: SortOrder
    gamesPlayed?: SortOrder
    gamesWon?: SortOrder
    winRate?: SortOrder
    currentStreak?: SortOrder
    bestStreak?: SortOrder
    lastActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    totalScore?: SortOrder
    gamesPlayed?: SortOrder
    gamesWon?: SortOrder
    winRate?: SortOrder
    currentStreak?: SortOrder
    bestStreak?: SortOrder
  }

  export type UuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumUserStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserStatus | EnumUserStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUserStatusWithAggregatesFilter<$PrismaModel> | $Enums.UserStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserStatusFilter<$PrismaModel>
    _max?: NestedEnumUserStatusFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type PasswordResetTokenCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    used?: SortOrder
    createdAt?: SortOrder
    usedAt?: SortOrder
  }

  export type PasswordResetTokenMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    used?: SortOrder
    createdAt?: SortOrder
    usedAt?: SortOrder
  }

  export type PasswordResetTokenMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    token?: SortOrder
    expiresAt?: SortOrder
    used?: SortOrder
    createdAt?: SortOrder
    usedAt?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type EnumSessionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SessionStatus | EnumSessionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSessionStatusFilter<$PrismaModel> | $Enums.SessionStatus
  }

  export type UserSessionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    sessionToken?: SortOrder
    deviceInfo?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    lastActivity?: SortOrder
  }

  export type UserSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    sessionToken?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    lastActivity?: SortOrder
  }

  export type UserSessionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    sessionToken?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    lastActivity?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type EnumSessionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SessionStatus | EnumSessionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSessionStatusWithAggregatesFilter<$PrismaModel> | $Enums.SessionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSessionStatusFilter<$PrismaModel>
    _max?: NestedEnumSessionStatusFilter<$PrismaModel>
  }

  export type EnumFriendshipStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.FriendshipStatus | EnumFriendshipStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FriendshipStatus[] | ListEnumFriendshipStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FriendshipStatus[] | ListEnumFriendshipStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFriendshipStatusFilter<$PrismaModel> | $Enums.FriendshipStatus
  }

  export type FriendshipRequesterIdReceiverIdCompoundUniqueInput = {
    requesterId: string
    receiverId: string
  }

  export type FriendshipCountOrderByAggregateInput = {
    id?: SortOrder
    requesterId?: SortOrder
    receiverId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FriendshipMaxOrderByAggregateInput = {
    id?: SortOrder
    requesterId?: SortOrder
    receiverId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FriendshipMinOrderByAggregateInput = {
    id?: SortOrder
    requesterId?: SortOrder
    receiverId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumFriendshipStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FriendshipStatus | EnumFriendshipStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FriendshipStatus[] | ListEnumFriendshipStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FriendshipStatus[] | ListEnumFriendshipStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFriendshipStatusWithAggregatesFilter<$PrismaModel> | $Enums.FriendshipStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFriendshipStatusFilter<$PrismaModel>
    _max?: NestedEnumFriendshipStatusFilter<$PrismaModel>
  }

  export type EnumGameTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.GameType | EnumGameTypeFieldRefInput<$PrismaModel>
    in?: $Enums.GameType[] | ListEnumGameTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.GameType[] | ListEnumGameTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumGameTypeFilter<$PrismaModel> | $Enums.GameType
  }

  export type EnumGameStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.GameStatus | EnumGameStatusFieldRefInput<$PrismaModel>
    in?: $Enums.GameStatus[] | ListEnumGameStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.GameStatus[] | ListEnumGameStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumGameStatusFilter<$PrismaModel> | $Enums.GameStatus
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type GameRoundListRelationFilter = {
    every?: GameRoundWhereInput
    some?: GameRoundWhereInput
    none?: GameRoundWhereInput
  }

  export type GameRoundOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GameSessionCountOrderByAggregateInput = {
    id?: SortOrder
    roomCode?: SortOrder
    gameType?: SortOrder
    status?: SortOrder
    maxPlayers?: SortOrder
    currentRound?: SortOrder
    totalRounds?: SortOrder
    maxMistakes?: SortOrder
    difficulty?: SortOrder
    timeLimit?: SortOrder
    createdAt?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GameSessionAvgOrderByAggregateInput = {
    maxPlayers?: SortOrder
    currentRound?: SortOrder
    totalRounds?: SortOrder
    maxMistakes?: SortOrder
    timeLimit?: SortOrder
  }

  export type GameSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    roomCode?: SortOrder
    gameType?: SortOrder
    status?: SortOrder
    maxPlayers?: SortOrder
    currentRound?: SortOrder
    totalRounds?: SortOrder
    maxMistakes?: SortOrder
    difficulty?: SortOrder
    timeLimit?: SortOrder
    createdAt?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GameSessionMinOrderByAggregateInput = {
    id?: SortOrder
    roomCode?: SortOrder
    gameType?: SortOrder
    status?: SortOrder
    maxPlayers?: SortOrder
    currentRound?: SortOrder
    totalRounds?: SortOrder
    maxMistakes?: SortOrder
    difficulty?: SortOrder
    timeLimit?: SortOrder
    createdAt?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GameSessionSumOrderByAggregateInput = {
    maxPlayers?: SortOrder
    currentRound?: SortOrder
    totalRounds?: SortOrder
    maxMistakes?: SortOrder
    timeLimit?: SortOrder
  }

  export type EnumGameTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GameType | EnumGameTypeFieldRefInput<$PrismaModel>
    in?: $Enums.GameType[] | ListEnumGameTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.GameType[] | ListEnumGameTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumGameTypeWithAggregatesFilter<$PrismaModel> | $Enums.GameType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumGameTypeFilter<$PrismaModel>
    _max?: NestedEnumGameTypeFilter<$PrismaModel>
  }

  export type EnumGameStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GameStatus | EnumGameStatusFieldRefInput<$PrismaModel>
    in?: $Enums.GameStatus[] | ListEnumGameStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.GameStatus[] | ListEnumGameStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumGameStatusWithAggregatesFilter<$PrismaModel> | $Enums.GameStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumGameStatusFilter<$PrismaModel>
    _max?: NestedEnumGameStatusFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type GameSessionScalarRelationFilter = {
    is?: GameSessionWhereInput
    isNot?: GameSessionWhereInput
  }

  export type GameScoreListRelationFilter = {
    every?: GameScoreWhereInput
    some?: GameScoreWhereInput
    none?: GameScoreWhereInput
  }

  export type GameScoreOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GameParticipantGameSessionIdUserIdCompoundUniqueInput = {
    gameSessionId: string
    userId: string
  }

  export type GameParticipantCountOrderByAggregateInput = {
    id?: SortOrder
    gameSessionId?: SortOrder
    userId?: SortOrder
    position?: SortOrder
    isReady?: SortOrder
    isConnected?: SortOrder
    finalScore?: SortOrder
    finalRank?: SortOrder
    mistakeCount?: SortOrder
    joinedAt?: SortOrder
    leftAt?: SortOrder
  }

  export type GameParticipantAvgOrderByAggregateInput = {
    position?: SortOrder
    finalScore?: SortOrder
    finalRank?: SortOrder
    mistakeCount?: SortOrder
  }

  export type GameParticipantMaxOrderByAggregateInput = {
    id?: SortOrder
    gameSessionId?: SortOrder
    userId?: SortOrder
    position?: SortOrder
    isReady?: SortOrder
    isConnected?: SortOrder
    finalScore?: SortOrder
    finalRank?: SortOrder
    mistakeCount?: SortOrder
    joinedAt?: SortOrder
    leftAt?: SortOrder
  }

  export type GameParticipantMinOrderByAggregateInput = {
    id?: SortOrder
    gameSessionId?: SortOrder
    userId?: SortOrder
    position?: SortOrder
    isReady?: SortOrder
    isConnected?: SortOrder
    finalScore?: SortOrder
    finalRank?: SortOrder
    mistakeCount?: SortOrder
    joinedAt?: SortOrder
    leftAt?: SortOrder
  }

  export type GameParticipantSumOrderByAggregateInput = {
    position?: SortOrder
    finalScore?: SortOrder
    finalRank?: SortOrder
    mistakeCount?: SortOrder
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type GameRoundGameSessionIdRoundNumberCompoundUniqueInput = {
    gameSessionId: string
    roundNumber: number
  }

  export type GameRoundCountOrderByAggregateInput = {
    id?: SortOrder
    gameSessionId?: SortOrder
    roundNumber?: SortOrder
    verse?: SortOrder
    blanks?: SortOrder
    emojiMapping?: SortOrder
    correctBook?: SortOrder
    correctRef?: SortOrder
    context?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
  }

  export type GameRoundAvgOrderByAggregateInput = {
    roundNumber?: SortOrder
  }

  export type GameRoundMaxOrderByAggregateInput = {
    id?: SortOrder
    gameSessionId?: SortOrder
    roundNumber?: SortOrder
    verse?: SortOrder
    correctBook?: SortOrder
    correctRef?: SortOrder
    context?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
  }

  export type GameRoundMinOrderByAggregateInput = {
    id?: SortOrder
    gameSessionId?: SortOrder
    roundNumber?: SortOrder
    verse?: SortOrder
    correctBook?: SortOrder
    correctRef?: SortOrder
    context?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
  }

  export type GameRoundSumOrderByAggregateInput = {
    roundNumber?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type GameParticipantScalarRelationFilter = {
    is?: GameParticipantWhereInput
    isNot?: GameParticipantWhereInput
  }

  export type GameRoundScalarRelationFilter = {
    is?: GameRoundWhereInput
    isNot?: GameRoundWhereInput
  }

  export type GameScoreCountOrderByAggregateInput = {
    id?: SortOrder
    participantId?: SortOrder
    roundId?: SortOrder
    blanksScore?: SortOrder
    contextScore?: SortOrder
    bookScore?: SortOrder
    referenceScore?: SortOrder
    timeBonus?: SortOrder
    streakBonus?: SortOrder
    totalScore?: SortOrder
    timeSpent?: SortOrder
    mistakesMade?: SortOrder
    hintsUsed?: SortOrder
    createdAt?: SortOrder
  }

  export type GameScoreAvgOrderByAggregateInput = {
    blanksScore?: SortOrder
    contextScore?: SortOrder
    bookScore?: SortOrder
    referenceScore?: SortOrder
    timeBonus?: SortOrder
    streakBonus?: SortOrder
    totalScore?: SortOrder
    timeSpent?: SortOrder
    mistakesMade?: SortOrder
    hintsUsed?: SortOrder
  }

  export type GameScoreMaxOrderByAggregateInput = {
    id?: SortOrder
    participantId?: SortOrder
    roundId?: SortOrder
    blanksScore?: SortOrder
    contextScore?: SortOrder
    bookScore?: SortOrder
    referenceScore?: SortOrder
    timeBonus?: SortOrder
    streakBonus?: SortOrder
    totalScore?: SortOrder
    timeSpent?: SortOrder
    mistakesMade?: SortOrder
    hintsUsed?: SortOrder
    createdAt?: SortOrder
  }

  export type GameScoreMinOrderByAggregateInput = {
    id?: SortOrder
    participantId?: SortOrder
    roundId?: SortOrder
    blanksScore?: SortOrder
    contextScore?: SortOrder
    bookScore?: SortOrder
    referenceScore?: SortOrder
    timeBonus?: SortOrder
    streakBonus?: SortOrder
    totalScore?: SortOrder
    timeSpent?: SortOrder
    mistakesMade?: SortOrder
    hintsUsed?: SortOrder
    createdAt?: SortOrder
  }

  export type GameScoreSumOrderByAggregateInput = {
    blanksScore?: SortOrder
    contextScore?: SortOrder
    bookScore?: SortOrder
    referenceScore?: SortOrder
    timeBonus?: SortOrder
    streakBonus?: SortOrder
    totalScore?: SortOrder
    timeSpent?: SortOrder
    mistakesMade?: SortOrder
    hintsUsed?: SortOrder
  }

  export type DailyChallengeCountOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    verse?: SortOrder
    blanks?: SortOrder
    emojiMapping?: SortOrder
    correctBook?: SortOrder
    correctRef?: SortOrder
    context?: SortOrder
    difficulty?: SortOrder
    maxAttempts?: SortOrder
    timeLimit?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
  }

  export type DailyChallengeAvgOrderByAggregateInput = {
    maxAttempts?: SortOrder
    timeLimit?: SortOrder
  }

  export type DailyChallengeMaxOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    verse?: SortOrder
    correctBook?: SortOrder
    correctRef?: SortOrder
    context?: SortOrder
    difficulty?: SortOrder
    maxAttempts?: SortOrder
    timeLimit?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
  }

  export type DailyChallengeMinOrderByAggregateInput = {
    id?: SortOrder
    date?: SortOrder
    verse?: SortOrder
    correctBook?: SortOrder
    correctRef?: SortOrder
    context?: SortOrder
    difficulty?: SortOrder
    maxAttempts?: SortOrder
    timeLimit?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
  }

  export type DailyChallengeSumOrderByAggregateInput = {
    maxAttempts?: SortOrder
    timeLimit?: SortOrder
  }

  export type DailyChallengeScalarRelationFilter = {
    is?: DailyChallengeWhereInput
    isNot?: DailyChallengeWhereInput
  }

  export type DailyChallengeAnswerChallengeIdUserIdCompoundUniqueInput = {
    challengeId: string
    userId: string
  }

  export type DailyChallengeAnswerCountOrderByAggregateInput = {
    id?: SortOrder
    challengeId?: SortOrder
    userId?: SortOrder
    userAnswers?: SortOrder
    isCorrect?: SortOrder
    score?: SortOrder
    timeSpent?: SortOrder
    hintsUsed?: SortOrder
    completedAt?: SortOrder
  }

  export type DailyChallengeAnswerAvgOrderByAggregateInput = {
    score?: SortOrder
    timeSpent?: SortOrder
    hintsUsed?: SortOrder
  }

  export type DailyChallengeAnswerMaxOrderByAggregateInput = {
    id?: SortOrder
    challengeId?: SortOrder
    userId?: SortOrder
    isCorrect?: SortOrder
    score?: SortOrder
    timeSpent?: SortOrder
    hintsUsed?: SortOrder
    completedAt?: SortOrder
  }

  export type DailyChallengeAnswerMinOrderByAggregateInput = {
    id?: SortOrder
    challengeId?: SortOrder
    userId?: SortOrder
    isCorrect?: SortOrder
    score?: SortOrder
    timeSpent?: SortOrder
    hintsUsed?: SortOrder
    completedAt?: SortOrder
  }

  export type DailyChallengeAnswerSumOrderByAggregateInput = {
    score?: SortOrder
    timeSpent?: SortOrder
    hintsUsed?: SortOrder
  }

  export type LeaderboardCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    globalRank?: SortOrder
    weeklyRank?: SortOrder
    monthlyRank?: SortOrder
    totalScore?: SortOrder
    gamesPlayed?: SortOrder
    gamesWon?: SortOrder
    winRate?: SortOrder
    currentStreak?: SortOrder
    bestStreak?: SortOrder
    lastUpdated?: SortOrder
  }

  export type LeaderboardAvgOrderByAggregateInput = {
    globalRank?: SortOrder
    weeklyRank?: SortOrder
    monthlyRank?: SortOrder
    totalScore?: SortOrder
    gamesPlayed?: SortOrder
    gamesWon?: SortOrder
    winRate?: SortOrder
    currentStreak?: SortOrder
    bestStreak?: SortOrder
  }

  export type LeaderboardMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    globalRank?: SortOrder
    weeklyRank?: SortOrder
    monthlyRank?: SortOrder
    totalScore?: SortOrder
    gamesPlayed?: SortOrder
    gamesWon?: SortOrder
    winRate?: SortOrder
    currentStreak?: SortOrder
    bestStreak?: SortOrder
    lastUpdated?: SortOrder
  }

  export type LeaderboardMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    globalRank?: SortOrder
    weeklyRank?: SortOrder
    monthlyRank?: SortOrder
    totalScore?: SortOrder
    gamesPlayed?: SortOrder
    gamesWon?: SortOrder
    winRate?: SortOrder
    currentStreak?: SortOrder
    bestStreak?: SortOrder
    lastUpdated?: SortOrder
  }

  export type LeaderboardSumOrderByAggregateInput = {
    globalRank?: SortOrder
    weeklyRank?: SortOrder
    monthlyRank?: SortOrder
    totalScore?: SortOrder
    gamesPlayed?: SortOrder
    gamesWon?: SortOrder
    winRate?: SortOrder
    currentStreak?: SortOrder
    bestStreak?: SortOrder
  }

  export type UserSessionCreateNestedManyWithoutUserInput = {
    create?: XOR<UserSessionCreateWithoutUserInput, UserSessionUncheckedCreateWithoutUserInput> | UserSessionCreateWithoutUserInput[] | UserSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserSessionCreateOrConnectWithoutUserInput | UserSessionCreateOrConnectWithoutUserInput[]
    createMany?: UserSessionCreateManyUserInputEnvelope
    connect?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
  }

  export type PasswordResetTokenCreateNestedManyWithoutUserInput = {
    create?: XOR<PasswordResetTokenCreateWithoutUserInput, PasswordResetTokenUncheckedCreateWithoutUserInput> | PasswordResetTokenCreateWithoutUserInput[] | PasswordResetTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PasswordResetTokenCreateOrConnectWithoutUserInput | PasswordResetTokenCreateOrConnectWithoutUserInput[]
    createMany?: PasswordResetTokenCreateManyUserInputEnvelope
    connect?: PasswordResetTokenWhereUniqueInput | PasswordResetTokenWhereUniqueInput[]
  }

  export type FriendshipCreateNestedManyWithoutRequesterInput = {
    create?: XOR<FriendshipCreateWithoutRequesterInput, FriendshipUncheckedCreateWithoutRequesterInput> | FriendshipCreateWithoutRequesterInput[] | FriendshipUncheckedCreateWithoutRequesterInput[]
    connectOrCreate?: FriendshipCreateOrConnectWithoutRequesterInput | FriendshipCreateOrConnectWithoutRequesterInput[]
    createMany?: FriendshipCreateManyRequesterInputEnvelope
    connect?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
  }

  export type FriendshipCreateNestedManyWithoutReceiverInput = {
    create?: XOR<FriendshipCreateWithoutReceiverInput, FriendshipUncheckedCreateWithoutReceiverInput> | FriendshipCreateWithoutReceiverInput[] | FriendshipUncheckedCreateWithoutReceiverInput[]
    connectOrCreate?: FriendshipCreateOrConnectWithoutReceiverInput | FriendshipCreateOrConnectWithoutReceiverInput[]
    createMany?: FriendshipCreateManyReceiverInputEnvelope
    connect?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
  }

  export type GameParticipantCreateNestedManyWithoutUserInput = {
    create?: XOR<GameParticipantCreateWithoutUserInput, GameParticipantUncheckedCreateWithoutUserInput> | GameParticipantCreateWithoutUserInput[] | GameParticipantUncheckedCreateWithoutUserInput[]
    connectOrCreate?: GameParticipantCreateOrConnectWithoutUserInput | GameParticipantCreateOrConnectWithoutUserInput[]
    createMany?: GameParticipantCreateManyUserInputEnvelope
    connect?: GameParticipantWhereUniqueInput | GameParticipantWhereUniqueInput[]
  }

  export type DailyChallengeAnswerCreateNestedManyWithoutUserInput = {
    create?: XOR<DailyChallengeAnswerCreateWithoutUserInput, DailyChallengeAnswerUncheckedCreateWithoutUserInput> | DailyChallengeAnswerCreateWithoutUserInput[] | DailyChallengeAnswerUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DailyChallengeAnswerCreateOrConnectWithoutUserInput | DailyChallengeAnswerCreateOrConnectWithoutUserInput[]
    createMany?: DailyChallengeAnswerCreateManyUserInputEnvelope
    connect?: DailyChallengeAnswerWhereUniqueInput | DailyChallengeAnswerWhereUniqueInput[]
  }

  export type LeaderboardCreateNestedOneWithoutUserInput = {
    create?: XOR<LeaderboardCreateWithoutUserInput, LeaderboardUncheckedCreateWithoutUserInput>
    connectOrCreate?: LeaderboardCreateOrConnectWithoutUserInput
    connect?: LeaderboardWhereUniqueInput
  }

  export type UserSessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<UserSessionCreateWithoutUserInput, UserSessionUncheckedCreateWithoutUserInput> | UserSessionCreateWithoutUserInput[] | UserSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserSessionCreateOrConnectWithoutUserInput | UserSessionCreateOrConnectWithoutUserInput[]
    createMany?: UserSessionCreateManyUserInputEnvelope
    connect?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
  }

  export type PasswordResetTokenUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<PasswordResetTokenCreateWithoutUserInput, PasswordResetTokenUncheckedCreateWithoutUserInput> | PasswordResetTokenCreateWithoutUserInput[] | PasswordResetTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PasswordResetTokenCreateOrConnectWithoutUserInput | PasswordResetTokenCreateOrConnectWithoutUserInput[]
    createMany?: PasswordResetTokenCreateManyUserInputEnvelope
    connect?: PasswordResetTokenWhereUniqueInput | PasswordResetTokenWhereUniqueInput[]
  }

  export type FriendshipUncheckedCreateNestedManyWithoutRequesterInput = {
    create?: XOR<FriendshipCreateWithoutRequesterInput, FriendshipUncheckedCreateWithoutRequesterInput> | FriendshipCreateWithoutRequesterInput[] | FriendshipUncheckedCreateWithoutRequesterInput[]
    connectOrCreate?: FriendshipCreateOrConnectWithoutRequesterInput | FriendshipCreateOrConnectWithoutRequesterInput[]
    createMany?: FriendshipCreateManyRequesterInputEnvelope
    connect?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
  }

  export type FriendshipUncheckedCreateNestedManyWithoutReceiverInput = {
    create?: XOR<FriendshipCreateWithoutReceiverInput, FriendshipUncheckedCreateWithoutReceiverInput> | FriendshipCreateWithoutReceiverInput[] | FriendshipUncheckedCreateWithoutReceiverInput[]
    connectOrCreate?: FriendshipCreateOrConnectWithoutReceiverInput | FriendshipCreateOrConnectWithoutReceiverInput[]
    createMany?: FriendshipCreateManyReceiverInputEnvelope
    connect?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
  }

  export type GameParticipantUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<GameParticipantCreateWithoutUserInput, GameParticipantUncheckedCreateWithoutUserInput> | GameParticipantCreateWithoutUserInput[] | GameParticipantUncheckedCreateWithoutUserInput[]
    connectOrCreate?: GameParticipantCreateOrConnectWithoutUserInput | GameParticipantCreateOrConnectWithoutUserInput[]
    createMany?: GameParticipantCreateManyUserInputEnvelope
    connect?: GameParticipantWhereUniqueInput | GameParticipantWhereUniqueInput[]
  }

  export type DailyChallengeAnswerUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<DailyChallengeAnswerCreateWithoutUserInput, DailyChallengeAnswerUncheckedCreateWithoutUserInput> | DailyChallengeAnswerCreateWithoutUserInput[] | DailyChallengeAnswerUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DailyChallengeAnswerCreateOrConnectWithoutUserInput | DailyChallengeAnswerCreateOrConnectWithoutUserInput[]
    createMany?: DailyChallengeAnswerCreateManyUserInputEnvelope
    connect?: DailyChallengeAnswerWhereUniqueInput | DailyChallengeAnswerWhereUniqueInput[]
  }

  export type LeaderboardUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<LeaderboardCreateWithoutUserInput, LeaderboardUncheckedCreateWithoutUserInput>
    connectOrCreate?: LeaderboardCreateOrConnectWithoutUserInput
    connect?: LeaderboardWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumUserStatusFieldUpdateOperationsInput = {
    set?: $Enums.UserStatus
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type UserSessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserSessionCreateWithoutUserInput, UserSessionUncheckedCreateWithoutUserInput> | UserSessionCreateWithoutUserInput[] | UserSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserSessionCreateOrConnectWithoutUserInput | UserSessionCreateOrConnectWithoutUserInput[]
    upsert?: UserSessionUpsertWithWhereUniqueWithoutUserInput | UserSessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserSessionCreateManyUserInputEnvelope
    set?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    disconnect?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    delete?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    connect?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    update?: UserSessionUpdateWithWhereUniqueWithoutUserInput | UserSessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserSessionUpdateManyWithWhereWithoutUserInput | UserSessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserSessionScalarWhereInput | UserSessionScalarWhereInput[]
  }

  export type PasswordResetTokenUpdateManyWithoutUserNestedInput = {
    create?: XOR<PasswordResetTokenCreateWithoutUserInput, PasswordResetTokenUncheckedCreateWithoutUserInput> | PasswordResetTokenCreateWithoutUserInput[] | PasswordResetTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PasswordResetTokenCreateOrConnectWithoutUserInput | PasswordResetTokenCreateOrConnectWithoutUserInput[]
    upsert?: PasswordResetTokenUpsertWithWhereUniqueWithoutUserInput | PasswordResetTokenUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PasswordResetTokenCreateManyUserInputEnvelope
    set?: PasswordResetTokenWhereUniqueInput | PasswordResetTokenWhereUniqueInput[]
    disconnect?: PasswordResetTokenWhereUniqueInput | PasswordResetTokenWhereUniqueInput[]
    delete?: PasswordResetTokenWhereUniqueInput | PasswordResetTokenWhereUniqueInput[]
    connect?: PasswordResetTokenWhereUniqueInput | PasswordResetTokenWhereUniqueInput[]
    update?: PasswordResetTokenUpdateWithWhereUniqueWithoutUserInput | PasswordResetTokenUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PasswordResetTokenUpdateManyWithWhereWithoutUserInput | PasswordResetTokenUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PasswordResetTokenScalarWhereInput | PasswordResetTokenScalarWhereInput[]
  }

  export type FriendshipUpdateManyWithoutRequesterNestedInput = {
    create?: XOR<FriendshipCreateWithoutRequesterInput, FriendshipUncheckedCreateWithoutRequesterInput> | FriendshipCreateWithoutRequesterInput[] | FriendshipUncheckedCreateWithoutRequesterInput[]
    connectOrCreate?: FriendshipCreateOrConnectWithoutRequesterInput | FriendshipCreateOrConnectWithoutRequesterInput[]
    upsert?: FriendshipUpsertWithWhereUniqueWithoutRequesterInput | FriendshipUpsertWithWhereUniqueWithoutRequesterInput[]
    createMany?: FriendshipCreateManyRequesterInputEnvelope
    set?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    disconnect?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    delete?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    connect?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    update?: FriendshipUpdateWithWhereUniqueWithoutRequesterInput | FriendshipUpdateWithWhereUniqueWithoutRequesterInput[]
    updateMany?: FriendshipUpdateManyWithWhereWithoutRequesterInput | FriendshipUpdateManyWithWhereWithoutRequesterInput[]
    deleteMany?: FriendshipScalarWhereInput | FriendshipScalarWhereInput[]
  }

  export type FriendshipUpdateManyWithoutReceiverNestedInput = {
    create?: XOR<FriendshipCreateWithoutReceiverInput, FriendshipUncheckedCreateWithoutReceiverInput> | FriendshipCreateWithoutReceiverInput[] | FriendshipUncheckedCreateWithoutReceiverInput[]
    connectOrCreate?: FriendshipCreateOrConnectWithoutReceiverInput | FriendshipCreateOrConnectWithoutReceiverInput[]
    upsert?: FriendshipUpsertWithWhereUniqueWithoutReceiverInput | FriendshipUpsertWithWhereUniqueWithoutReceiverInput[]
    createMany?: FriendshipCreateManyReceiverInputEnvelope
    set?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    disconnect?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    delete?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    connect?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    update?: FriendshipUpdateWithWhereUniqueWithoutReceiverInput | FriendshipUpdateWithWhereUniqueWithoutReceiverInput[]
    updateMany?: FriendshipUpdateManyWithWhereWithoutReceiverInput | FriendshipUpdateManyWithWhereWithoutReceiverInput[]
    deleteMany?: FriendshipScalarWhereInput | FriendshipScalarWhereInput[]
  }

  export type GameParticipantUpdateManyWithoutUserNestedInput = {
    create?: XOR<GameParticipantCreateWithoutUserInput, GameParticipantUncheckedCreateWithoutUserInput> | GameParticipantCreateWithoutUserInput[] | GameParticipantUncheckedCreateWithoutUserInput[]
    connectOrCreate?: GameParticipantCreateOrConnectWithoutUserInput | GameParticipantCreateOrConnectWithoutUserInput[]
    upsert?: GameParticipantUpsertWithWhereUniqueWithoutUserInput | GameParticipantUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: GameParticipantCreateManyUserInputEnvelope
    set?: GameParticipantWhereUniqueInput | GameParticipantWhereUniqueInput[]
    disconnect?: GameParticipantWhereUniqueInput | GameParticipantWhereUniqueInput[]
    delete?: GameParticipantWhereUniqueInput | GameParticipantWhereUniqueInput[]
    connect?: GameParticipantWhereUniqueInput | GameParticipantWhereUniqueInput[]
    update?: GameParticipantUpdateWithWhereUniqueWithoutUserInput | GameParticipantUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: GameParticipantUpdateManyWithWhereWithoutUserInput | GameParticipantUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: GameParticipantScalarWhereInput | GameParticipantScalarWhereInput[]
  }

  export type DailyChallengeAnswerUpdateManyWithoutUserNestedInput = {
    create?: XOR<DailyChallengeAnswerCreateWithoutUserInput, DailyChallengeAnswerUncheckedCreateWithoutUserInput> | DailyChallengeAnswerCreateWithoutUserInput[] | DailyChallengeAnswerUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DailyChallengeAnswerCreateOrConnectWithoutUserInput | DailyChallengeAnswerCreateOrConnectWithoutUserInput[]
    upsert?: DailyChallengeAnswerUpsertWithWhereUniqueWithoutUserInput | DailyChallengeAnswerUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: DailyChallengeAnswerCreateManyUserInputEnvelope
    set?: DailyChallengeAnswerWhereUniqueInput | DailyChallengeAnswerWhereUniqueInput[]
    disconnect?: DailyChallengeAnswerWhereUniqueInput | DailyChallengeAnswerWhereUniqueInput[]
    delete?: DailyChallengeAnswerWhereUniqueInput | DailyChallengeAnswerWhereUniqueInput[]
    connect?: DailyChallengeAnswerWhereUniqueInput | DailyChallengeAnswerWhereUniqueInput[]
    update?: DailyChallengeAnswerUpdateWithWhereUniqueWithoutUserInput | DailyChallengeAnswerUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: DailyChallengeAnswerUpdateManyWithWhereWithoutUserInput | DailyChallengeAnswerUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: DailyChallengeAnswerScalarWhereInput | DailyChallengeAnswerScalarWhereInput[]
  }

  export type LeaderboardUpdateOneWithoutUserNestedInput = {
    create?: XOR<LeaderboardCreateWithoutUserInput, LeaderboardUncheckedCreateWithoutUserInput>
    connectOrCreate?: LeaderboardCreateOrConnectWithoutUserInput
    upsert?: LeaderboardUpsertWithoutUserInput
    disconnect?: LeaderboardWhereInput | boolean
    delete?: LeaderboardWhereInput | boolean
    connect?: LeaderboardWhereUniqueInput
    update?: XOR<XOR<LeaderboardUpdateToOneWithWhereWithoutUserInput, LeaderboardUpdateWithoutUserInput>, LeaderboardUncheckedUpdateWithoutUserInput>
  }

  export type UserSessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserSessionCreateWithoutUserInput, UserSessionUncheckedCreateWithoutUserInput> | UserSessionCreateWithoutUserInput[] | UserSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserSessionCreateOrConnectWithoutUserInput | UserSessionCreateOrConnectWithoutUserInput[]
    upsert?: UserSessionUpsertWithWhereUniqueWithoutUserInput | UserSessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserSessionCreateManyUserInputEnvelope
    set?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    disconnect?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    delete?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    connect?: UserSessionWhereUniqueInput | UserSessionWhereUniqueInput[]
    update?: UserSessionUpdateWithWhereUniqueWithoutUserInput | UserSessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserSessionUpdateManyWithWhereWithoutUserInput | UserSessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserSessionScalarWhereInput | UserSessionScalarWhereInput[]
  }

  export type PasswordResetTokenUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<PasswordResetTokenCreateWithoutUserInput, PasswordResetTokenUncheckedCreateWithoutUserInput> | PasswordResetTokenCreateWithoutUserInput[] | PasswordResetTokenUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PasswordResetTokenCreateOrConnectWithoutUserInput | PasswordResetTokenCreateOrConnectWithoutUserInput[]
    upsert?: PasswordResetTokenUpsertWithWhereUniqueWithoutUserInput | PasswordResetTokenUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PasswordResetTokenCreateManyUserInputEnvelope
    set?: PasswordResetTokenWhereUniqueInput | PasswordResetTokenWhereUniqueInput[]
    disconnect?: PasswordResetTokenWhereUniqueInput | PasswordResetTokenWhereUniqueInput[]
    delete?: PasswordResetTokenWhereUniqueInput | PasswordResetTokenWhereUniqueInput[]
    connect?: PasswordResetTokenWhereUniqueInput | PasswordResetTokenWhereUniqueInput[]
    update?: PasswordResetTokenUpdateWithWhereUniqueWithoutUserInput | PasswordResetTokenUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PasswordResetTokenUpdateManyWithWhereWithoutUserInput | PasswordResetTokenUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PasswordResetTokenScalarWhereInput | PasswordResetTokenScalarWhereInput[]
  }

  export type FriendshipUncheckedUpdateManyWithoutRequesterNestedInput = {
    create?: XOR<FriendshipCreateWithoutRequesterInput, FriendshipUncheckedCreateWithoutRequesterInput> | FriendshipCreateWithoutRequesterInput[] | FriendshipUncheckedCreateWithoutRequesterInput[]
    connectOrCreate?: FriendshipCreateOrConnectWithoutRequesterInput | FriendshipCreateOrConnectWithoutRequesterInput[]
    upsert?: FriendshipUpsertWithWhereUniqueWithoutRequesterInput | FriendshipUpsertWithWhereUniqueWithoutRequesterInput[]
    createMany?: FriendshipCreateManyRequesterInputEnvelope
    set?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    disconnect?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    delete?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    connect?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    update?: FriendshipUpdateWithWhereUniqueWithoutRequesterInput | FriendshipUpdateWithWhereUniqueWithoutRequesterInput[]
    updateMany?: FriendshipUpdateManyWithWhereWithoutRequesterInput | FriendshipUpdateManyWithWhereWithoutRequesterInput[]
    deleteMany?: FriendshipScalarWhereInput | FriendshipScalarWhereInput[]
  }

  export type FriendshipUncheckedUpdateManyWithoutReceiverNestedInput = {
    create?: XOR<FriendshipCreateWithoutReceiverInput, FriendshipUncheckedCreateWithoutReceiverInput> | FriendshipCreateWithoutReceiverInput[] | FriendshipUncheckedCreateWithoutReceiverInput[]
    connectOrCreate?: FriendshipCreateOrConnectWithoutReceiverInput | FriendshipCreateOrConnectWithoutReceiverInput[]
    upsert?: FriendshipUpsertWithWhereUniqueWithoutReceiverInput | FriendshipUpsertWithWhereUniqueWithoutReceiverInput[]
    createMany?: FriendshipCreateManyReceiverInputEnvelope
    set?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    disconnect?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    delete?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    connect?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    update?: FriendshipUpdateWithWhereUniqueWithoutReceiverInput | FriendshipUpdateWithWhereUniqueWithoutReceiverInput[]
    updateMany?: FriendshipUpdateManyWithWhereWithoutReceiverInput | FriendshipUpdateManyWithWhereWithoutReceiverInput[]
    deleteMany?: FriendshipScalarWhereInput | FriendshipScalarWhereInput[]
  }

  export type GameParticipantUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<GameParticipantCreateWithoutUserInput, GameParticipantUncheckedCreateWithoutUserInput> | GameParticipantCreateWithoutUserInput[] | GameParticipantUncheckedCreateWithoutUserInput[]
    connectOrCreate?: GameParticipantCreateOrConnectWithoutUserInput | GameParticipantCreateOrConnectWithoutUserInput[]
    upsert?: GameParticipantUpsertWithWhereUniqueWithoutUserInput | GameParticipantUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: GameParticipantCreateManyUserInputEnvelope
    set?: GameParticipantWhereUniqueInput | GameParticipantWhereUniqueInput[]
    disconnect?: GameParticipantWhereUniqueInput | GameParticipantWhereUniqueInput[]
    delete?: GameParticipantWhereUniqueInput | GameParticipantWhereUniqueInput[]
    connect?: GameParticipantWhereUniqueInput | GameParticipantWhereUniqueInput[]
    update?: GameParticipantUpdateWithWhereUniqueWithoutUserInput | GameParticipantUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: GameParticipantUpdateManyWithWhereWithoutUserInput | GameParticipantUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: GameParticipantScalarWhereInput | GameParticipantScalarWhereInput[]
  }

  export type DailyChallengeAnswerUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<DailyChallengeAnswerCreateWithoutUserInput, DailyChallengeAnswerUncheckedCreateWithoutUserInput> | DailyChallengeAnswerCreateWithoutUserInput[] | DailyChallengeAnswerUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DailyChallengeAnswerCreateOrConnectWithoutUserInput | DailyChallengeAnswerCreateOrConnectWithoutUserInput[]
    upsert?: DailyChallengeAnswerUpsertWithWhereUniqueWithoutUserInput | DailyChallengeAnswerUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: DailyChallengeAnswerCreateManyUserInputEnvelope
    set?: DailyChallengeAnswerWhereUniqueInput | DailyChallengeAnswerWhereUniqueInput[]
    disconnect?: DailyChallengeAnswerWhereUniqueInput | DailyChallengeAnswerWhereUniqueInput[]
    delete?: DailyChallengeAnswerWhereUniqueInput | DailyChallengeAnswerWhereUniqueInput[]
    connect?: DailyChallengeAnswerWhereUniqueInput | DailyChallengeAnswerWhereUniqueInput[]
    update?: DailyChallengeAnswerUpdateWithWhereUniqueWithoutUserInput | DailyChallengeAnswerUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: DailyChallengeAnswerUpdateManyWithWhereWithoutUserInput | DailyChallengeAnswerUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: DailyChallengeAnswerScalarWhereInput | DailyChallengeAnswerScalarWhereInput[]
  }

  export type LeaderboardUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<LeaderboardCreateWithoutUserInput, LeaderboardUncheckedCreateWithoutUserInput>
    connectOrCreate?: LeaderboardCreateOrConnectWithoutUserInput
    upsert?: LeaderboardUpsertWithoutUserInput
    disconnect?: LeaderboardWhereInput | boolean
    delete?: LeaderboardWhereInput | boolean
    connect?: LeaderboardWhereUniqueInput
    update?: XOR<XOR<LeaderboardUpdateToOneWithWhereWithoutUserInput, LeaderboardUpdateWithoutUserInput>, LeaderboardUncheckedUpdateWithoutUserInput>
  }

  export type UserCreateNestedOneWithoutPasswordResetTokensInput = {
    create?: XOR<UserCreateWithoutPasswordResetTokensInput, UserUncheckedCreateWithoutPasswordResetTokensInput>
    connectOrCreate?: UserCreateOrConnectWithoutPasswordResetTokensInput
    connect?: UserWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type UserUpdateOneRequiredWithoutPasswordResetTokensNestedInput = {
    create?: XOR<UserCreateWithoutPasswordResetTokensInput, UserUncheckedCreateWithoutPasswordResetTokensInput>
    connectOrCreate?: UserCreateOrConnectWithoutPasswordResetTokensInput
    upsert?: UserUpsertWithoutPasswordResetTokensInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPasswordResetTokensInput, UserUpdateWithoutPasswordResetTokensInput>, UserUncheckedUpdateWithoutPasswordResetTokensInput>
  }

  export type UserCreateNestedOneWithoutSessionsInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type EnumSessionStatusFieldUpdateOperationsInput = {
    set?: $Enums.SessionStatus
  }

  export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSessionsInput
    upsert?: UserUpsertWithoutSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSessionsInput, UserUpdateWithoutSessionsInput>, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserCreateNestedOneWithoutSentFriendRequestsInput = {
    create?: XOR<UserCreateWithoutSentFriendRequestsInput, UserUncheckedCreateWithoutSentFriendRequestsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSentFriendRequestsInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutReceivedFriendRequestsInput = {
    create?: XOR<UserCreateWithoutReceivedFriendRequestsInput, UserUncheckedCreateWithoutReceivedFriendRequestsInput>
    connectOrCreate?: UserCreateOrConnectWithoutReceivedFriendRequestsInput
    connect?: UserWhereUniqueInput
  }

  export type EnumFriendshipStatusFieldUpdateOperationsInput = {
    set?: $Enums.FriendshipStatus
  }

  export type UserUpdateOneRequiredWithoutSentFriendRequestsNestedInput = {
    create?: XOR<UserCreateWithoutSentFriendRequestsInput, UserUncheckedCreateWithoutSentFriendRequestsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSentFriendRequestsInput
    upsert?: UserUpsertWithoutSentFriendRequestsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSentFriendRequestsInput, UserUpdateWithoutSentFriendRequestsInput>, UserUncheckedUpdateWithoutSentFriendRequestsInput>
  }

  export type UserUpdateOneRequiredWithoutReceivedFriendRequestsNestedInput = {
    create?: XOR<UserCreateWithoutReceivedFriendRequestsInput, UserUncheckedCreateWithoutReceivedFriendRequestsInput>
    connectOrCreate?: UserCreateOrConnectWithoutReceivedFriendRequestsInput
    upsert?: UserUpsertWithoutReceivedFriendRequestsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutReceivedFriendRequestsInput, UserUpdateWithoutReceivedFriendRequestsInput>, UserUncheckedUpdateWithoutReceivedFriendRequestsInput>
  }

  export type GameParticipantCreateNestedManyWithoutGameSessionInput = {
    create?: XOR<GameParticipantCreateWithoutGameSessionInput, GameParticipantUncheckedCreateWithoutGameSessionInput> | GameParticipantCreateWithoutGameSessionInput[] | GameParticipantUncheckedCreateWithoutGameSessionInput[]
    connectOrCreate?: GameParticipantCreateOrConnectWithoutGameSessionInput | GameParticipantCreateOrConnectWithoutGameSessionInput[]
    createMany?: GameParticipantCreateManyGameSessionInputEnvelope
    connect?: GameParticipantWhereUniqueInput | GameParticipantWhereUniqueInput[]
  }

  export type GameRoundCreateNestedManyWithoutGameSessionInput = {
    create?: XOR<GameRoundCreateWithoutGameSessionInput, GameRoundUncheckedCreateWithoutGameSessionInput> | GameRoundCreateWithoutGameSessionInput[] | GameRoundUncheckedCreateWithoutGameSessionInput[]
    connectOrCreate?: GameRoundCreateOrConnectWithoutGameSessionInput | GameRoundCreateOrConnectWithoutGameSessionInput[]
    createMany?: GameRoundCreateManyGameSessionInputEnvelope
    connect?: GameRoundWhereUniqueInput | GameRoundWhereUniqueInput[]
  }

  export type GameParticipantUncheckedCreateNestedManyWithoutGameSessionInput = {
    create?: XOR<GameParticipantCreateWithoutGameSessionInput, GameParticipantUncheckedCreateWithoutGameSessionInput> | GameParticipantCreateWithoutGameSessionInput[] | GameParticipantUncheckedCreateWithoutGameSessionInput[]
    connectOrCreate?: GameParticipantCreateOrConnectWithoutGameSessionInput | GameParticipantCreateOrConnectWithoutGameSessionInput[]
    createMany?: GameParticipantCreateManyGameSessionInputEnvelope
    connect?: GameParticipantWhereUniqueInput | GameParticipantWhereUniqueInput[]
  }

  export type GameRoundUncheckedCreateNestedManyWithoutGameSessionInput = {
    create?: XOR<GameRoundCreateWithoutGameSessionInput, GameRoundUncheckedCreateWithoutGameSessionInput> | GameRoundCreateWithoutGameSessionInput[] | GameRoundUncheckedCreateWithoutGameSessionInput[]
    connectOrCreate?: GameRoundCreateOrConnectWithoutGameSessionInput | GameRoundCreateOrConnectWithoutGameSessionInput[]
    createMany?: GameRoundCreateManyGameSessionInputEnvelope
    connect?: GameRoundWhereUniqueInput | GameRoundWhereUniqueInput[]
  }

  export type EnumGameTypeFieldUpdateOperationsInput = {
    set?: $Enums.GameType
  }

  export type EnumGameStatusFieldUpdateOperationsInput = {
    set?: $Enums.GameStatus
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type GameParticipantUpdateManyWithoutGameSessionNestedInput = {
    create?: XOR<GameParticipantCreateWithoutGameSessionInput, GameParticipantUncheckedCreateWithoutGameSessionInput> | GameParticipantCreateWithoutGameSessionInput[] | GameParticipantUncheckedCreateWithoutGameSessionInput[]
    connectOrCreate?: GameParticipantCreateOrConnectWithoutGameSessionInput | GameParticipantCreateOrConnectWithoutGameSessionInput[]
    upsert?: GameParticipantUpsertWithWhereUniqueWithoutGameSessionInput | GameParticipantUpsertWithWhereUniqueWithoutGameSessionInput[]
    createMany?: GameParticipantCreateManyGameSessionInputEnvelope
    set?: GameParticipantWhereUniqueInput | GameParticipantWhereUniqueInput[]
    disconnect?: GameParticipantWhereUniqueInput | GameParticipantWhereUniqueInput[]
    delete?: GameParticipantWhereUniqueInput | GameParticipantWhereUniqueInput[]
    connect?: GameParticipantWhereUniqueInput | GameParticipantWhereUniqueInput[]
    update?: GameParticipantUpdateWithWhereUniqueWithoutGameSessionInput | GameParticipantUpdateWithWhereUniqueWithoutGameSessionInput[]
    updateMany?: GameParticipantUpdateManyWithWhereWithoutGameSessionInput | GameParticipantUpdateManyWithWhereWithoutGameSessionInput[]
    deleteMany?: GameParticipantScalarWhereInput | GameParticipantScalarWhereInput[]
  }

  export type GameRoundUpdateManyWithoutGameSessionNestedInput = {
    create?: XOR<GameRoundCreateWithoutGameSessionInput, GameRoundUncheckedCreateWithoutGameSessionInput> | GameRoundCreateWithoutGameSessionInput[] | GameRoundUncheckedCreateWithoutGameSessionInput[]
    connectOrCreate?: GameRoundCreateOrConnectWithoutGameSessionInput | GameRoundCreateOrConnectWithoutGameSessionInput[]
    upsert?: GameRoundUpsertWithWhereUniqueWithoutGameSessionInput | GameRoundUpsertWithWhereUniqueWithoutGameSessionInput[]
    createMany?: GameRoundCreateManyGameSessionInputEnvelope
    set?: GameRoundWhereUniqueInput | GameRoundWhereUniqueInput[]
    disconnect?: GameRoundWhereUniqueInput | GameRoundWhereUniqueInput[]
    delete?: GameRoundWhereUniqueInput | GameRoundWhereUniqueInput[]
    connect?: GameRoundWhereUniqueInput | GameRoundWhereUniqueInput[]
    update?: GameRoundUpdateWithWhereUniqueWithoutGameSessionInput | GameRoundUpdateWithWhereUniqueWithoutGameSessionInput[]
    updateMany?: GameRoundUpdateManyWithWhereWithoutGameSessionInput | GameRoundUpdateManyWithWhereWithoutGameSessionInput[]
    deleteMany?: GameRoundScalarWhereInput | GameRoundScalarWhereInput[]
  }

  export type GameParticipantUncheckedUpdateManyWithoutGameSessionNestedInput = {
    create?: XOR<GameParticipantCreateWithoutGameSessionInput, GameParticipantUncheckedCreateWithoutGameSessionInput> | GameParticipantCreateWithoutGameSessionInput[] | GameParticipantUncheckedCreateWithoutGameSessionInput[]
    connectOrCreate?: GameParticipantCreateOrConnectWithoutGameSessionInput | GameParticipantCreateOrConnectWithoutGameSessionInput[]
    upsert?: GameParticipantUpsertWithWhereUniqueWithoutGameSessionInput | GameParticipantUpsertWithWhereUniqueWithoutGameSessionInput[]
    createMany?: GameParticipantCreateManyGameSessionInputEnvelope
    set?: GameParticipantWhereUniqueInput | GameParticipantWhereUniqueInput[]
    disconnect?: GameParticipantWhereUniqueInput | GameParticipantWhereUniqueInput[]
    delete?: GameParticipantWhereUniqueInput | GameParticipantWhereUniqueInput[]
    connect?: GameParticipantWhereUniqueInput | GameParticipantWhereUniqueInput[]
    update?: GameParticipantUpdateWithWhereUniqueWithoutGameSessionInput | GameParticipantUpdateWithWhereUniqueWithoutGameSessionInput[]
    updateMany?: GameParticipantUpdateManyWithWhereWithoutGameSessionInput | GameParticipantUpdateManyWithWhereWithoutGameSessionInput[]
    deleteMany?: GameParticipantScalarWhereInput | GameParticipantScalarWhereInput[]
  }

  export type GameRoundUncheckedUpdateManyWithoutGameSessionNestedInput = {
    create?: XOR<GameRoundCreateWithoutGameSessionInput, GameRoundUncheckedCreateWithoutGameSessionInput> | GameRoundCreateWithoutGameSessionInput[] | GameRoundUncheckedCreateWithoutGameSessionInput[]
    connectOrCreate?: GameRoundCreateOrConnectWithoutGameSessionInput | GameRoundCreateOrConnectWithoutGameSessionInput[]
    upsert?: GameRoundUpsertWithWhereUniqueWithoutGameSessionInput | GameRoundUpsertWithWhereUniqueWithoutGameSessionInput[]
    createMany?: GameRoundCreateManyGameSessionInputEnvelope
    set?: GameRoundWhereUniqueInput | GameRoundWhereUniqueInput[]
    disconnect?: GameRoundWhereUniqueInput | GameRoundWhereUniqueInput[]
    delete?: GameRoundWhereUniqueInput | GameRoundWhereUniqueInput[]
    connect?: GameRoundWhereUniqueInput | GameRoundWhereUniqueInput[]
    update?: GameRoundUpdateWithWhereUniqueWithoutGameSessionInput | GameRoundUpdateWithWhereUniqueWithoutGameSessionInput[]
    updateMany?: GameRoundUpdateManyWithWhereWithoutGameSessionInput | GameRoundUpdateManyWithWhereWithoutGameSessionInput[]
    deleteMany?: GameRoundScalarWhereInput | GameRoundScalarWhereInput[]
  }

  export type GameSessionCreateNestedOneWithoutParticipantsInput = {
    create?: XOR<GameSessionCreateWithoutParticipantsInput, GameSessionUncheckedCreateWithoutParticipantsInput>
    connectOrCreate?: GameSessionCreateOrConnectWithoutParticipantsInput
    connect?: GameSessionWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutGameParticipationsInput = {
    create?: XOR<UserCreateWithoutGameParticipationsInput, UserUncheckedCreateWithoutGameParticipationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutGameParticipationsInput
    connect?: UserWhereUniqueInput
  }

  export type GameScoreCreateNestedManyWithoutParticipantInput = {
    create?: XOR<GameScoreCreateWithoutParticipantInput, GameScoreUncheckedCreateWithoutParticipantInput> | GameScoreCreateWithoutParticipantInput[] | GameScoreUncheckedCreateWithoutParticipantInput[]
    connectOrCreate?: GameScoreCreateOrConnectWithoutParticipantInput | GameScoreCreateOrConnectWithoutParticipantInput[]
    createMany?: GameScoreCreateManyParticipantInputEnvelope
    connect?: GameScoreWhereUniqueInput | GameScoreWhereUniqueInput[]
  }

  export type GameScoreUncheckedCreateNestedManyWithoutParticipantInput = {
    create?: XOR<GameScoreCreateWithoutParticipantInput, GameScoreUncheckedCreateWithoutParticipantInput> | GameScoreCreateWithoutParticipantInput[] | GameScoreUncheckedCreateWithoutParticipantInput[]
    connectOrCreate?: GameScoreCreateOrConnectWithoutParticipantInput | GameScoreCreateOrConnectWithoutParticipantInput[]
    createMany?: GameScoreCreateManyParticipantInputEnvelope
    connect?: GameScoreWhereUniqueInput | GameScoreWhereUniqueInput[]
  }

  export type GameSessionUpdateOneRequiredWithoutParticipantsNestedInput = {
    create?: XOR<GameSessionCreateWithoutParticipantsInput, GameSessionUncheckedCreateWithoutParticipantsInput>
    connectOrCreate?: GameSessionCreateOrConnectWithoutParticipantsInput
    upsert?: GameSessionUpsertWithoutParticipantsInput
    connect?: GameSessionWhereUniqueInput
    update?: XOR<XOR<GameSessionUpdateToOneWithWhereWithoutParticipantsInput, GameSessionUpdateWithoutParticipantsInput>, GameSessionUncheckedUpdateWithoutParticipantsInput>
  }

  export type UserUpdateOneRequiredWithoutGameParticipationsNestedInput = {
    create?: XOR<UserCreateWithoutGameParticipationsInput, UserUncheckedCreateWithoutGameParticipationsInput>
    connectOrCreate?: UserCreateOrConnectWithoutGameParticipationsInput
    upsert?: UserUpsertWithoutGameParticipationsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutGameParticipationsInput, UserUpdateWithoutGameParticipationsInput>, UserUncheckedUpdateWithoutGameParticipationsInput>
  }

  export type GameScoreUpdateManyWithoutParticipantNestedInput = {
    create?: XOR<GameScoreCreateWithoutParticipantInput, GameScoreUncheckedCreateWithoutParticipantInput> | GameScoreCreateWithoutParticipantInput[] | GameScoreUncheckedCreateWithoutParticipantInput[]
    connectOrCreate?: GameScoreCreateOrConnectWithoutParticipantInput | GameScoreCreateOrConnectWithoutParticipantInput[]
    upsert?: GameScoreUpsertWithWhereUniqueWithoutParticipantInput | GameScoreUpsertWithWhereUniqueWithoutParticipantInput[]
    createMany?: GameScoreCreateManyParticipantInputEnvelope
    set?: GameScoreWhereUniqueInput | GameScoreWhereUniqueInput[]
    disconnect?: GameScoreWhereUniqueInput | GameScoreWhereUniqueInput[]
    delete?: GameScoreWhereUniqueInput | GameScoreWhereUniqueInput[]
    connect?: GameScoreWhereUniqueInput | GameScoreWhereUniqueInput[]
    update?: GameScoreUpdateWithWhereUniqueWithoutParticipantInput | GameScoreUpdateWithWhereUniqueWithoutParticipantInput[]
    updateMany?: GameScoreUpdateManyWithWhereWithoutParticipantInput | GameScoreUpdateManyWithWhereWithoutParticipantInput[]
    deleteMany?: GameScoreScalarWhereInput | GameScoreScalarWhereInput[]
  }

  export type GameScoreUncheckedUpdateManyWithoutParticipantNestedInput = {
    create?: XOR<GameScoreCreateWithoutParticipantInput, GameScoreUncheckedCreateWithoutParticipantInput> | GameScoreCreateWithoutParticipantInput[] | GameScoreUncheckedCreateWithoutParticipantInput[]
    connectOrCreate?: GameScoreCreateOrConnectWithoutParticipantInput | GameScoreCreateOrConnectWithoutParticipantInput[]
    upsert?: GameScoreUpsertWithWhereUniqueWithoutParticipantInput | GameScoreUpsertWithWhereUniqueWithoutParticipantInput[]
    createMany?: GameScoreCreateManyParticipantInputEnvelope
    set?: GameScoreWhereUniqueInput | GameScoreWhereUniqueInput[]
    disconnect?: GameScoreWhereUniqueInput | GameScoreWhereUniqueInput[]
    delete?: GameScoreWhereUniqueInput | GameScoreWhereUniqueInput[]
    connect?: GameScoreWhereUniqueInput | GameScoreWhereUniqueInput[]
    update?: GameScoreUpdateWithWhereUniqueWithoutParticipantInput | GameScoreUpdateWithWhereUniqueWithoutParticipantInput[]
    updateMany?: GameScoreUpdateManyWithWhereWithoutParticipantInput | GameScoreUpdateManyWithWhereWithoutParticipantInput[]
    deleteMany?: GameScoreScalarWhereInput | GameScoreScalarWhereInput[]
  }

  export type GameSessionCreateNestedOneWithoutRoundsInput = {
    create?: XOR<GameSessionCreateWithoutRoundsInput, GameSessionUncheckedCreateWithoutRoundsInput>
    connectOrCreate?: GameSessionCreateOrConnectWithoutRoundsInput
    connect?: GameSessionWhereUniqueInput
  }

  export type GameScoreCreateNestedManyWithoutRoundInput = {
    create?: XOR<GameScoreCreateWithoutRoundInput, GameScoreUncheckedCreateWithoutRoundInput> | GameScoreCreateWithoutRoundInput[] | GameScoreUncheckedCreateWithoutRoundInput[]
    connectOrCreate?: GameScoreCreateOrConnectWithoutRoundInput | GameScoreCreateOrConnectWithoutRoundInput[]
    createMany?: GameScoreCreateManyRoundInputEnvelope
    connect?: GameScoreWhereUniqueInput | GameScoreWhereUniqueInput[]
  }

  export type GameScoreUncheckedCreateNestedManyWithoutRoundInput = {
    create?: XOR<GameScoreCreateWithoutRoundInput, GameScoreUncheckedCreateWithoutRoundInput> | GameScoreCreateWithoutRoundInput[] | GameScoreUncheckedCreateWithoutRoundInput[]
    connectOrCreate?: GameScoreCreateOrConnectWithoutRoundInput | GameScoreCreateOrConnectWithoutRoundInput[]
    createMany?: GameScoreCreateManyRoundInputEnvelope
    connect?: GameScoreWhereUniqueInput | GameScoreWhereUniqueInput[]
  }

  export type GameSessionUpdateOneRequiredWithoutRoundsNestedInput = {
    create?: XOR<GameSessionCreateWithoutRoundsInput, GameSessionUncheckedCreateWithoutRoundsInput>
    connectOrCreate?: GameSessionCreateOrConnectWithoutRoundsInput
    upsert?: GameSessionUpsertWithoutRoundsInput
    connect?: GameSessionWhereUniqueInput
    update?: XOR<XOR<GameSessionUpdateToOneWithWhereWithoutRoundsInput, GameSessionUpdateWithoutRoundsInput>, GameSessionUncheckedUpdateWithoutRoundsInput>
  }

  export type GameScoreUpdateManyWithoutRoundNestedInput = {
    create?: XOR<GameScoreCreateWithoutRoundInput, GameScoreUncheckedCreateWithoutRoundInput> | GameScoreCreateWithoutRoundInput[] | GameScoreUncheckedCreateWithoutRoundInput[]
    connectOrCreate?: GameScoreCreateOrConnectWithoutRoundInput | GameScoreCreateOrConnectWithoutRoundInput[]
    upsert?: GameScoreUpsertWithWhereUniqueWithoutRoundInput | GameScoreUpsertWithWhereUniqueWithoutRoundInput[]
    createMany?: GameScoreCreateManyRoundInputEnvelope
    set?: GameScoreWhereUniqueInput | GameScoreWhereUniqueInput[]
    disconnect?: GameScoreWhereUniqueInput | GameScoreWhereUniqueInput[]
    delete?: GameScoreWhereUniqueInput | GameScoreWhereUniqueInput[]
    connect?: GameScoreWhereUniqueInput | GameScoreWhereUniqueInput[]
    update?: GameScoreUpdateWithWhereUniqueWithoutRoundInput | GameScoreUpdateWithWhereUniqueWithoutRoundInput[]
    updateMany?: GameScoreUpdateManyWithWhereWithoutRoundInput | GameScoreUpdateManyWithWhereWithoutRoundInput[]
    deleteMany?: GameScoreScalarWhereInput | GameScoreScalarWhereInput[]
  }

  export type GameScoreUncheckedUpdateManyWithoutRoundNestedInput = {
    create?: XOR<GameScoreCreateWithoutRoundInput, GameScoreUncheckedCreateWithoutRoundInput> | GameScoreCreateWithoutRoundInput[] | GameScoreUncheckedCreateWithoutRoundInput[]
    connectOrCreate?: GameScoreCreateOrConnectWithoutRoundInput | GameScoreCreateOrConnectWithoutRoundInput[]
    upsert?: GameScoreUpsertWithWhereUniqueWithoutRoundInput | GameScoreUpsertWithWhereUniqueWithoutRoundInput[]
    createMany?: GameScoreCreateManyRoundInputEnvelope
    set?: GameScoreWhereUniqueInput | GameScoreWhereUniqueInput[]
    disconnect?: GameScoreWhereUniqueInput | GameScoreWhereUniqueInput[]
    delete?: GameScoreWhereUniqueInput | GameScoreWhereUniqueInput[]
    connect?: GameScoreWhereUniqueInput | GameScoreWhereUniqueInput[]
    update?: GameScoreUpdateWithWhereUniqueWithoutRoundInput | GameScoreUpdateWithWhereUniqueWithoutRoundInput[]
    updateMany?: GameScoreUpdateManyWithWhereWithoutRoundInput | GameScoreUpdateManyWithWhereWithoutRoundInput[]
    deleteMany?: GameScoreScalarWhereInput | GameScoreScalarWhereInput[]
  }

  export type GameParticipantCreateNestedOneWithoutScoresInput = {
    create?: XOR<GameParticipantCreateWithoutScoresInput, GameParticipantUncheckedCreateWithoutScoresInput>
    connectOrCreate?: GameParticipantCreateOrConnectWithoutScoresInput
    connect?: GameParticipantWhereUniqueInput
  }

  export type GameRoundCreateNestedOneWithoutScoresInput = {
    create?: XOR<GameRoundCreateWithoutScoresInput, GameRoundUncheckedCreateWithoutScoresInput>
    connectOrCreate?: GameRoundCreateOrConnectWithoutScoresInput
    connect?: GameRoundWhereUniqueInput
  }

  export type GameParticipantUpdateOneRequiredWithoutScoresNestedInput = {
    create?: XOR<GameParticipantCreateWithoutScoresInput, GameParticipantUncheckedCreateWithoutScoresInput>
    connectOrCreate?: GameParticipantCreateOrConnectWithoutScoresInput
    upsert?: GameParticipantUpsertWithoutScoresInput
    connect?: GameParticipantWhereUniqueInput
    update?: XOR<XOR<GameParticipantUpdateToOneWithWhereWithoutScoresInput, GameParticipantUpdateWithoutScoresInput>, GameParticipantUncheckedUpdateWithoutScoresInput>
  }

  export type GameRoundUpdateOneRequiredWithoutScoresNestedInput = {
    create?: XOR<GameRoundCreateWithoutScoresInput, GameRoundUncheckedCreateWithoutScoresInput>
    connectOrCreate?: GameRoundCreateOrConnectWithoutScoresInput
    upsert?: GameRoundUpsertWithoutScoresInput
    connect?: GameRoundWhereUniqueInput
    update?: XOR<XOR<GameRoundUpdateToOneWithWhereWithoutScoresInput, GameRoundUpdateWithoutScoresInput>, GameRoundUncheckedUpdateWithoutScoresInput>
  }

  export type DailyChallengeAnswerCreateNestedManyWithoutChallengeInput = {
    create?: XOR<DailyChallengeAnswerCreateWithoutChallengeInput, DailyChallengeAnswerUncheckedCreateWithoutChallengeInput> | DailyChallengeAnswerCreateWithoutChallengeInput[] | DailyChallengeAnswerUncheckedCreateWithoutChallengeInput[]
    connectOrCreate?: DailyChallengeAnswerCreateOrConnectWithoutChallengeInput | DailyChallengeAnswerCreateOrConnectWithoutChallengeInput[]
    createMany?: DailyChallengeAnswerCreateManyChallengeInputEnvelope
    connect?: DailyChallengeAnswerWhereUniqueInput | DailyChallengeAnswerWhereUniqueInput[]
  }

  export type DailyChallengeAnswerUncheckedCreateNestedManyWithoutChallengeInput = {
    create?: XOR<DailyChallengeAnswerCreateWithoutChallengeInput, DailyChallengeAnswerUncheckedCreateWithoutChallengeInput> | DailyChallengeAnswerCreateWithoutChallengeInput[] | DailyChallengeAnswerUncheckedCreateWithoutChallengeInput[]
    connectOrCreate?: DailyChallengeAnswerCreateOrConnectWithoutChallengeInput | DailyChallengeAnswerCreateOrConnectWithoutChallengeInput[]
    createMany?: DailyChallengeAnswerCreateManyChallengeInputEnvelope
    connect?: DailyChallengeAnswerWhereUniqueInput | DailyChallengeAnswerWhereUniqueInput[]
  }

  export type DailyChallengeAnswerUpdateManyWithoutChallengeNestedInput = {
    create?: XOR<DailyChallengeAnswerCreateWithoutChallengeInput, DailyChallengeAnswerUncheckedCreateWithoutChallengeInput> | DailyChallengeAnswerCreateWithoutChallengeInput[] | DailyChallengeAnswerUncheckedCreateWithoutChallengeInput[]
    connectOrCreate?: DailyChallengeAnswerCreateOrConnectWithoutChallengeInput | DailyChallengeAnswerCreateOrConnectWithoutChallengeInput[]
    upsert?: DailyChallengeAnswerUpsertWithWhereUniqueWithoutChallengeInput | DailyChallengeAnswerUpsertWithWhereUniqueWithoutChallengeInput[]
    createMany?: DailyChallengeAnswerCreateManyChallengeInputEnvelope
    set?: DailyChallengeAnswerWhereUniqueInput | DailyChallengeAnswerWhereUniqueInput[]
    disconnect?: DailyChallengeAnswerWhereUniqueInput | DailyChallengeAnswerWhereUniqueInput[]
    delete?: DailyChallengeAnswerWhereUniqueInput | DailyChallengeAnswerWhereUniqueInput[]
    connect?: DailyChallengeAnswerWhereUniqueInput | DailyChallengeAnswerWhereUniqueInput[]
    update?: DailyChallengeAnswerUpdateWithWhereUniqueWithoutChallengeInput | DailyChallengeAnswerUpdateWithWhereUniqueWithoutChallengeInput[]
    updateMany?: DailyChallengeAnswerUpdateManyWithWhereWithoutChallengeInput | DailyChallengeAnswerUpdateManyWithWhereWithoutChallengeInput[]
    deleteMany?: DailyChallengeAnswerScalarWhereInput | DailyChallengeAnswerScalarWhereInput[]
  }

  export type DailyChallengeAnswerUncheckedUpdateManyWithoutChallengeNestedInput = {
    create?: XOR<DailyChallengeAnswerCreateWithoutChallengeInput, DailyChallengeAnswerUncheckedCreateWithoutChallengeInput> | DailyChallengeAnswerCreateWithoutChallengeInput[] | DailyChallengeAnswerUncheckedCreateWithoutChallengeInput[]
    connectOrCreate?: DailyChallengeAnswerCreateOrConnectWithoutChallengeInput | DailyChallengeAnswerCreateOrConnectWithoutChallengeInput[]
    upsert?: DailyChallengeAnswerUpsertWithWhereUniqueWithoutChallengeInput | DailyChallengeAnswerUpsertWithWhereUniqueWithoutChallengeInput[]
    createMany?: DailyChallengeAnswerCreateManyChallengeInputEnvelope
    set?: DailyChallengeAnswerWhereUniqueInput | DailyChallengeAnswerWhereUniqueInput[]
    disconnect?: DailyChallengeAnswerWhereUniqueInput | DailyChallengeAnswerWhereUniqueInput[]
    delete?: DailyChallengeAnswerWhereUniqueInput | DailyChallengeAnswerWhereUniqueInput[]
    connect?: DailyChallengeAnswerWhereUniqueInput | DailyChallengeAnswerWhereUniqueInput[]
    update?: DailyChallengeAnswerUpdateWithWhereUniqueWithoutChallengeInput | DailyChallengeAnswerUpdateWithWhereUniqueWithoutChallengeInput[]
    updateMany?: DailyChallengeAnswerUpdateManyWithWhereWithoutChallengeInput | DailyChallengeAnswerUpdateManyWithWhereWithoutChallengeInput[]
    deleteMany?: DailyChallengeAnswerScalarWhereInput | DailyChallengeAnswerScalarWhereInput[]
  }

  export type DailyChallengeCreateNestedOneWithoutAnswersInput = {
    create?: XOR<DailyChallengeCreateWithoutAnswersInput, DailyChallengeUncheckedCreateWithoutAnswersInput>
    connectOrCreate?: DailyChallengeCreateOrConnectWithoutAnswersInput
    connect?: DailyChallengeWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutDailyChallengeAnswersInput = {
    create?: XOR<UserCreateWithoutDailyChallengeAnswersInput, UserUncheckedCreateWithoutDailyChallengeAnswersInput>
    connectOrCreate?: UserCreateOrConnectWithoutDailyChallengeAnswersInput
    connect?: UserWhereUniqueInput
  }

  export type DailyChallengeUpdateOneRequiredWithoutAnswersNestedInput = {
    create?: XOR<DailyChallengeCreateWithoutAnswersInput, DailyChallengeUncheckedCreateWithoutAnswersInput>
    connectOrCreate?: DailyChallengeCreateOrConnectWithoutAnswersInput
    upsert?: DailyChallengeUpsertWithoutAnswersInput
    connect?: DailyChallengeWhereUniqueInput
    update?: XOR<XOR<DailyChallengeUpdateToOneWithWhereWithoutAnswersInput, DailyChallengeUpdateWithoutAnswersInput>, DailyChallengeUncheckedUpdateWithoutAnswersInput>
  }

  export type UserUpdateOneRequiredWithoutDailyChallengeAnswersNestedInput = {
    create?: XOR<UserCreateWithoutDailyChallengeAnswersInput, UserUncheckedCreateWithoutDailyChallengeAnswersInput>
    connectOrCreate?: UserCreateOrConnectWithoutDailyChallengeAnswersInput
    upsert?: UserUpsertWithoutDailyChallengeAnswersInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutDailyChallengeAnswersInput, UserUpdateWithoutDailyChallengeAnswersInput>, UserUncheckedUpdateWithoutDailyChallengeAnswersInput>
  }

  export type UserCreateNestedOneWithoutLeaderboardEntryInput = {
    create?: XOR<UserCreateWithoutLeaderboardEntryInput, UserUncheckedCreateWithoutLeaderboardEntryInput>
    connectOrCreate?: UserCreateOrConnectWithoutLeaderboardEntryInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutLeaderboardEntryNestedInput = {
    create?: XOR<UserCreateWithoutLeaderboardEntryInput, UserUncheckedCreateWithoutLeaderboardEntryInput>
    connectOrCreate?: UserCreateOrConnectWithoutLeaderboardEntryInput
    upsert?: UserUpsertWithoutLeaderboardEntryInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutLeaderboardEntryInput, UserUpdateWithoutLeaderboardEntryInput>, UserUncheckedUpdateWithoutLeaderboardEntryInput>
  }

  export type NestedUuidFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidFilter<$PrismaModel> | string
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumUserStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.UserStatus | EnumUserStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUserStatusFilter<$PrismaModel> | $Enums.UserStatus
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedUuidWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedUuidWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumUserStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserStatus | EnumUserStatusFieldRefInput<$PrismaModel>
    in?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.UserStatus[] | ListEnumUserStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumUserStatusWithAggregatesFilter<$PrismaModel> | $Enums.UserStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumUserStatusFilter<$PrismaModel>
    _max?: NestedEnumUserStatusFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumSessionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SessionStatus | EnumSessionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSessionStatusFilter<$PrismaModel> | $Enums.SessionStatus
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumSessionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SessionStatus | EnumSessionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SessionStatus[] | ListEnumSessionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSessionStatusWithAggregatesFilter<$PrismaModel> | $Enums.SessionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSessionStatusFilter<$PrismaModel>
    _max?: NestedEnumSessionStatusFilter<$PrismaModel>
  }

  export type NestedEnumFriendshipStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.FriendshipStatus | EnumFriendshipStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FriendshipStatus[] | ListEnumFriendshipStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FriendshipStatus[] | ListEnumFriendshipStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFriendshipStatusFilter<$PrismaModel> | $Enums.FriendshipStatus
  }

  export type NestedEnumFriendshipStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FriendshipStatus | EnumFriendshipStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FriendshipStatus[] | ListEnumFriendshipStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FriendshipStatus[] | ListEnumFriendshipStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFriendshipStatusWithAggregatesFilter<$PrismaModel> | $Enums.FriendshipStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFriendshipStatusFilter<$PrismaModel>
    _max?: NestedEnumFriendshipStatusFilter<$PrismaModel>
  }

  export type NestedEnumGameTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.GameType | EnumGameTypeFieldRefInput<$PrismaModel>
    in?: $Enums.GameType[] | ListEnumGameTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.GameType[] | ListEnumGameTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumGameTypeFilter<$PrismaModel> | $Enums.GameType
  }

  export type NestedEnumGameStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.GameStatus | EnumGameStatusFieldRefInput<$PrismaModel>
    in?: $Enums.GameStatus[] | ListEnumGameStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.GameStatus[] | ListEnumGameStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumGameStatusFilter<$PrismaModel> | $Enums.GameStatus
  }

  export type NestedEnumGameTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GameType | EnumGameTypeFieldRefInput<$PrismaModel>
    in?: $Enums.GameType[] | ListEnumGameTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.GameType[] | ListEnumGameTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumGameTypeWithAggregatesFilter<$PrismaModel> | $Enums.GameType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumGameTypeFilter<$PrismaModel>
    _max?: NestedEnumGameTypeFilter<$PrismaModel>
  }

  export type NestedEnumGameStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GameStatus | EnumGameStatusFieldRefInput<$PrismaModel>
    in?: $Enums.GameStatus[] | ListEnumGameStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.GameStatus[] | ListEnumGameStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumGameStatusWithAggregatesFilter<$PrismaModel> | $Enums.GameStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumGameStatusFilter<$PrismaModel>
    _max?: NestedEnumGameStatusFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type UserSessionCreateWithoutUserInput = {
    id?: string
    sessionToken: string
    deviceInfo?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    userAgent?: string | null
    status?: $Enums.SessionStatus
    createdAt?: Date | string
    expiresAt: Date | string
    lastActivity?: Date | string
  }

  export type UserSessionUncheckedCreateWithoutUserInput = {
    id?: string
    sessionToken: string
    deviceInfo?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    userAgent?: string | null
    status?: $Enums.SessionStatus
    createdAt?: Date | string
    expiresAt: Date | string
    lastActivity?: Date | string
  }

  export type UserSessionCreateOrConnectWithoutUserInput = {
    where: UserSessionWhereUniqueInput
    create: XOR<UserSessionCreateWithoutUserInput, UserSessionUncheckedCreateWithoutUserInput>
  }

  export type UserSessionCreateManyUserInputEnvelope = {
    data: UserSessionCreateManyUserInput | UserSessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type PasswordResetTokenCreateWithoutUserInput = {
    id?: string
    token: string
    expiresAt: Date | string
    used?: boolean
    createdAt?: Date | string
    usedAt?: Date | string | null
  }

  export type PasswordResetTokenUncheckedCreateWithoutUserInput = {
    id?: string
    token: string
    expiresAt: Date | string
    used?: boolean
    createdAt?: Date | string
    usedAt?: Date | string | null
  }

  export type PasswordResetTokenCreateOrConnectWithoutUserInput = {
    where: PasswordResetTokenWhereUniqueInput
    create: XOR<PasswordResetTokenCreateWithoutUserInput, PasswordResetTokenUncheckedCreateWithoutUserInput>
  }

  export type PasswordResetTokenCreateManyUserInputEnvelope = {
    data: PasswordResetTokenCreateManyUserInput | PasswordResetTokenCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type FriendshipCreateWithoutRequesterInput = {
    id?: string
    status?: $Enums.FriendshipStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    receiver: UserCreateNestedOneWithoutReceivedFriendRequestsInput
  }

  export type FriendshipUncheckedCreateWithoutRequesterInput = {
    id?: string
    receiverId: string
    status?: $Enums.FriendshipStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FriendshipCreateOrConnectWithoutRequesterInput = {
    where: FriendshipWhereUniqueInput
    create: XOR<FriendshipCreateWithoutRequesterInput, FriendshipUncheckedCreateWithoutRequesterInput>
  }

  export type FriendshipCreateManyRequesterInputEnvelope = {
    data: FriendshipCreateManyRequesterInput | FriendshipCreateManyRequesterInput[]
    skipDuplicates?: boolean
  }

  export type FriendshipCreateWithoutReceiverInput = {
    id?: string
    status?: $Enums.FriendshipStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    requester: UserCreateNestedOneWithoutSentFriendRequestsInput
  }

  export type FriendshipUncheckedCreateWithoutReceiverInput = {
    id?: string
    requesterId: string
    status?: $Enums.FriendshipStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FriendshipCreateOrConnectWithoutReceiverInput = {
    where: FriendshipWhereUniqueInput
    create: XOR<FriendshipCreateWithoutReceiverInput, FriendshipUncheckedCreateWithoutReceiverInput>
  }

  export type FriendshipCreateManyReceiverInputEnvelope = {
    data: FriendshipCreateManyReceiverInput | FriendshipCreateManyReceiverInput[]
    skipDuplicates?: boolean
  }

  export type GameParticipantCreateWithoutUserInput = {
    id?: string
    position?: number
    isReady?: boolean
    isConnected?: boolean
    finalScore?: number
    finalRank?: number | null
    mistakeCount?: number
    joinedAt?: Date | string
    leftAt?: Date | string | null
    gameSession: GameSessionCreateNestedOneWithoutParticipantsInput
    scores?: GameScoreCreateNestedManyWithoutParticipantInput
  }

  export type GameParticipantUncheckedCreateWithoutUserInput = {
    id?: string
    gameSessionId: string
    position?: number
    isReady?: boolean
    isConnected?: boolean
    finalScore?: number
    finalRank?: number | null
    mistakeCount?: number
    joinedAt?: Date | string
    leftAt?: Date | string | null
    scores?: GameScoreUncheckedCreateNestedManyWithoutParticipantInput
  }

  export type GameParticipantCreateOrConnectWithoutUserInput = {
    where: GameParticipantWhereUniqueInput
    create: XOR<GameParticipantCreateWithoutUserInput, GameParticipantUncheckedCreateWithoutUserInput>
  }

  export type GameParticipantCreateManyUserInputEnvelope = {
    data: GameParticipantCreateManyUserInput | GameParticipantCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type DailyChallengeAnswerCreateWithoutUserInput = {
    id?: string
    userAnswers: JsonNullValueInput | InputJsonValue
    isCorrect?: boolean
    score?: number
    timeSpent: number
    hintsUsed?: number
    completedAt?: Date | string
    challenge: DailyChallengeCreateNestedOneWithoutAnswersInput
  }

  export type DailyChallengeAnswerUncheckedCreateWithoutUserInput = {
    id?: string
    challengeId: string
    userAnswers: JsonNullValueInput | InputJsonValue
    isCorrect?: boolean
    score?: number
    timeSpent: number
    hintsUsed?: number
    completedAt?: Date | string
  }

  export type DailyChallengeAnswerCreateOrConnectWithoutUserInput = {
    where: DailyChallengeAnswerWhereUniqueInput
    create: XOR<DailyChallengeAnswerCreateWithoutUserInput, DailyChallengeAnswerUncheckedCreateWithoutUserInput>
  }

  export type DailyChallengeAnswerCreateManyUserInputEnvelope = {
    data: DailyChallengeAnswerCreateManyUserInput | DailyChallengeAnswerCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type LeaderboardCreateWithoutUserInput = {
    id?: string
    globalRank: number
    weeklyRank?: number | null
    monthlyRank?: number | null
    totalScore: number
    gamesPlayed: number
    gamesWon: number
    winRate: number
    currentStreak: number
    bestStreak: number
    lastUpdated?: Date | string
  }

  export type LeaderboardUncheckedCreateWithoutUserInput = {
    id?: string
    globalRank: number
    weeklyRank?: number | null
    monthlyRank?: number | null
    totalScore: number
    gamesPlayed: number
    gamesWon: number
    winRate: number
    currentStreak: number
    bestStreak: number
    lastUpdated?: Date | string
  }

  export type LeaderboardCreateOrConnectWithoutUserInput = {
    where: LeaderboardWhereUniqueInput
    create: XOR<LeaderboardCreateWithoutUserInput, LeaderboardUncheckedCreateWithoutUserInput>
  }

  export type UserSessionUpsertWithWhereUniqueWithoutUserInput = {
    where: UserSessionWhereUniqueInput
    update: XOR<UserSessionUpdateWithoutUserInput, UserSessionUncheckedUpdateWithoutUserInput>
    create: XOR<UserSessionCreateWithoutUserInput, UserSessionUncheckedCreateWithoutUserInput>
  }

  export type UserSessionUpdateWithWhereUniqueWithoutUserInput = {
    where: UserSessionWhereUniqueInput
    data: XOR<UserSessionUpdateWithoutUserInput, UserSessionUncheckedUpdateWithoutUserInput>
  }

  export type UserSessionUpdateManyWithWhereWithoutUserInput = {
    where: UserSessionScalarWhereInput
    data: XOR<UserSessionUpdateManyMutationInput, UserSessionUncheckedUpdateManyWithoutUserInput>
  }

  export type UserSessionScalarWhereInput = {
    AND?: UserSessionScalarWhereInput | UserSessionScalarWhereInput[]
    OR?: UserSessionScalarWhereInput[]
    NOT?: UserSessionScalarWhereInput | UserSessionScalarWhereInput[]
    id?: UuidFilter<"UserSession"> | string
    userId?: UuidFilter<"UserSession"> | string
    sessionToken?: StringFilter<"UserSession"> | string
    deviceInfo?: JsonNullableFilter<"UserSession">
    ipAddress?: StringNullableFilter<"UserSession"> | string | null
    userAgent?: StringNullableFilter<"UserSession"> | string | null
    status?: EnumSessionStatusFilter<"UserSession"> | $Enums.SessionStatus
    createdAt?: DateTimeFilter<"UserSession"> | Date | string
    expiresAt?: DateTimeFilter<"UserSession"> | Date | string
    lastActivity?: DateTimeFilter<"UserSession"> | Date | string
  }

  export type PasswordResetTokenUpsertWithWhereUniqueWithoutUserInput = {
    where: PasswordResetTokenWhereUniqueInput
    update: XOR<PasswordResetTokenUpdateWithoutUserInput, PasswordResetTokenUncheckedUpdateWithoutUserInput>
    create: XOR<PasswordResetTokenCreateWithoutUserInput, PasswordResetTokenUncheckedCreateWithoutUserInput>
  }

  export type PasswordResetTokenUpdateWithWhereUniqueWithoutUserInput = {
    where: PasswordResetTokenWhereUniqueInput
    data: XOR<PasswordResetTokenUpdateWithoutUserInput, PasswordResetTokenUncheckedUpdateWithoutUserInput>
  }

  export type PasswordResetTokenUpdateManyWithWhereWithoutUserInput = {
    where: PasswordResetTokenScalarWhereInput
    data: XOR<PasswordResetTokenUpdateManyMutationInput, PasswordResetTokenUncheckedUpdateManyWithoutUserInput>
  }

  export type PasswordResetTokenScalarWhereInput = {
    AND?: PasswordResetTokenScalarWhereInput | PasswordResetTokenScalarWhereInput[]
    OR?: PasswordResetTokenScalarWhereInput[]
    NOT?: PasswordResetTokenScalarWhereInput | PasswordResetTokenScalarWhereInput[]
    id?: UuidFilter<"PasswordResetToken"> | string
    userId?: UuidFilter<"PasswordResetToken"> | string
    token?: StringFilter<"PasswordResetToken"> | string
    expiresAt?: DateTimeFilter<"PasswordResetToken"> | Date | string
    used?: BoolFilter<"PasswordResetToken"> | boolean
    createdAt?: DateTimeFilter<"PasswordResetToken"> | Date | string
    usedAt?: DateTimeNullableFilter<"PasswordResetToken"> | Date | string | null
  }

  export type FriendshipUpsertWithWhereUniqueWithoutRequesterInput = {
    where: FriendshipWhereUniqueInput
    update: XOR<FriendshipUpdateWithoutRequesterInput, FriendshipUncheckedUpdateWithoutRequesterInput>
    create: XOR<FriendshipCreateWithoutRequesterInput, FriendshipUncheckedCreateWithoutRequesterInput>
  }

  export type FriendshipUpdateWithWhereUniqueWithoutRequesterInput = {
    where: FriendshipWhereUniqueInput
    data: XOR<FriendshipUpdateWithoutRequesterInput, FriendshipUncheckedUpdateWithoutRequesterInput>
  }

  export type FriendshipUpdateManyWithWhereWithoutRequesterInput = {
    where: FriendshipScalarWhereInput
    data: XOR<FriendshipUpdateManyMutationInput, FriendshipUncheckedUpdateManyWithoutRequesterInput>
  }

  export type FriendshipScalarWhereInput = {
    AND?: FriendshipScalarWhereInput | FriendshipScalarWhereInput[]
    OR?: FriendshipScalarWhereInput[]
    NOT?: FriendshipScalarWhereInput | FriendshipScalarWhereInput[]
    id?: UuidFilter<"Friendship"> | string
    requesterId?: UuidFilter<"Friendship"> | string
    receiverId?: UuidFilter<"Friendship"> | string
    status?: EnumFriendshipStatusFilter<"Friendship"> | $Enums.FriendshipStatus
    createdAt?: DateTimeFilter<"Friendship"> | Date | string
    updatedAt?: DateTimeFilter<"Friendship"> | Date | string
  }

  export type FriendshipUpsertWithWhereUniqueWithoutReceiverInput = {
    where: FriendshipWhereUniqueInput
    update: XOR<FriendshipUpdateWithoutReceiverInput, FriendshipUncheckedUpdateWithoutReceiverInput>
    create: XOR<FriendshipCreateWithoutReceiverInput, FriendshipUncheckedCreateWithoutReceiverInput>
  }

  export type FriendshipUpdateWithWhereUniqueWithoutReceiverInput = {
    where: FriendshipWhereUniqueInput
    data: XOR<FriendshipUpdateWithoutReceiverInput, FriendshipUncheckedUpdateWithoutReceiverInput>
  }

  export type FriendshipUpdateManyWithWhereWithoutReceiverInput = {
    where: FriendshipScalarWhereInput
    data: XOR<FriendshipUpdateManyMutationInput, FriendshipUncheckedUpdateManyWithoutReceiverInput>
  }

  export type GameParticipantUpsertWithWhereUniqueWithoutUserInput = {
    where: GameParticipantWhereUniqueInput
    update: XOR<GameParticipantUpdateWithoutUserInput, GameParticipantUncheckedUpdateWithoutUserInput>
    create: XOR<GameParticipantCreateWithoutUserInput, GameParticipantUncheckedCreateWithoutUserInput>
  }

  export type GameParticipantUpdateWithWhereUniqueWithoutUserInput = {
    where: GameParticipantWhereUniqueInput
    data: XOR<GameParticipantUpdateWithoutUserInput, GameParticipantUncheckedUpdateWithoutUserInput>
  }

  export type GameParticipantUpdateManyWithWhereWithoutUserInput = {
    where: GameParticipantScalarWhereInput
    data: XOR<GameParticipantUpdateManyMutationInput, GameParticipantUncheckedUpdateManyWithoutUserInput>
  }

  export type GameParticipantScalarWhereInput = {
    AND?: GameParticipantScalarWhereInput | GameParticipantScalarWhereInput[]
    OR?: GameParticipantScalarWhereInput[]
    NOT?: GameParticipantScalarWhereInput | GameParticipantScalarWhereInput[]
    id?: UuidFilter<"GameParticipant"> | string
    gameSessionId?: UuidFilter<"GameParticipant"> | string
    userId?: UuidFilter<"GameParticipant"> | string
    position?: IntFilter<"GameParticipant"> | number
    isReady?: BoolFilter<"GameParticipant"> | boolean
    isConnected?: BoolFilter<"GameParticipant"> | boolean
    finalScore?: IntFilter<"GameParticipant"> | number
    finalRank?: IntNullableFilter<"GameParticipant"> | number | null
    mistakeCount?: IntFilter<"GameParticipant"> | number
    joinedAt?: DateTimeFilter<"GameParticipant"> | Date | string
    leftAt?: DateTimeNullableFilter<"GameParticipant"> | Date | string | null
  }

  export type DailyChallengeAnswerUpsertWithWhereUniqueWithoutUserInput = {
    where: DailyChallengeAnswerWhereUniqueInput
    update: XOR<DailyChallengeAnswerUpdateWithoutUserInput, DailyChallengeAnswerUncheckedUpdateWithoutUserInput>
    create: XOR<DailyChallengeAnswerCreateWithoutUserInput, DailyChallengeAnswerUncheckedCreateWithoutUserInput>
  }

  export type DailyChallengeAnswerUpdateWithWhereUniqueWithoutUserInput = {
    where: DailyChallengeAnswerWhereUniqueInput
    data: XOR<DailyChallengeAnswerUpdateWithoutUserInput, DailyChallengeAnswerUncheckedUpdateWithoutUserInput>
  }

  export type DailyChallengeAnswerUpdateManyWithWhereWithoutUserInput = {
    where: DailyChallengeAnswerScalarWhereInput
    data: XOR<DailyChallengeAnswerUpdateManyMutationInput, DailyChallengeAnswerUncheckedUpdateManyWithoutUserInput>
  }

  export type DailyChallengeAnswerScalarWhereInput = {
    AND?: DailyChallengeAnswerScalarWhereInput | DailyChallengeAnswerScalarWhereInput[]
    OR?: DailyChallengeAnswerScalarWhereInput[]
    NOT?: DailyChallengeAnswerScalarWhereInput | DailyChallengeAnswerScalarWhereInput[]
    id?: UuidFilter<"DailyChallengeAnswer"> | string
    challengeId?: UuidFilter<"DailyChallengeAnswer"> | string
    userId?: UuidFilter<"DailyChallengeAnswer"> | string
    userAnswers?: JsonFilter<"DailyChallengeAnswer">
    isCorrect?: BoolFilter<"DailyChallengeAnswer"> | boolean
    score?: IntFilter<"DailyChallengeAnswer"> | number
    timeSpent?: IntFilter<"DailyChallengeAnswer"> | number
    hintsUsed?: IntFilter<"DailyChallengeAnswer"> | number
    completedAt?: DateTimeFilter<"DailyChallengeAnswer"> | Date | string
  }

  export type LeaderboardUpsertWithoutUserInput = {
    update: XOR<LeaderboardUpdateWithoutUserInput, LeaderboardUncheckedUpdateWithoutUserInput>
    create: XOR<LeaderboardCreateWithoutUserInput, LeaderboardUncheckedCreateWithoutUserInput>
    where?: LeaderboardWhereInput
  }

  export type LeaderboardUpdateToOneWithWhereWithoutUserInput = {
    where?: LeaderboardWhereInput
    data: XOR<LeaderboardUpdateWithoutUserInput, LeaderboardUncheckedUpdateWithoutUserInput>
  }

  export type LeaderboardUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    globalRank?: IntFieldUpdateOperationsInput | number
    weeklyRank?: NullableIntFieldUpdateOperationsInput | number | null
    monthlyRank?: NullableIntFieldUpdateOperationsInput | number | null
    totalScore?: IntFieldUpdateOperationsInput | number
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    gamesWon?: IntFieldUpdateOperationsInput | number
    winRate?: FloatFieldUpdateOperationsInput | number
    currentStreak?: IntFieldUpdateOperationsInput | number
    bestStreak?: IntFieldUpdateOperationsInput | number
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LeaderboardUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    globalRank?: IntFieldUpdateOperationsInput | number
    weeklyRank?: NullableIntFieldUpdateOperationsInput | number | null
    monthlyRank?: NullableIntFieldUpdateOperationsInput | number | null
    totalScore?: IntFieldUpdateOperationsInput | number
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    gamesWon?: IntFieldUpdateOperationsInput | number
    winRate?: FloatFieldUpdateOperationsInput | number
    currentStreak?: IntFieldUpdateOperationsInput | number
    bestStreak?: IntFieldUpdateOperationsInput | number
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutPasswordResetTokensInput = {
    id?: string
    email: string
    username: string
    firstName: string
    lastName: string
    phone?: string | null
    avatar?: string | null
    status?: $Enums.UserStatus
    totalScore?: number
    gamesPlayed?: number
    gamesWon?: number
    winRate?: number
    currentStreak?: number
    bestStreak?: number
    lastActive?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: UserSessionCreateNestedManyWithoutUserInput
    sentFriendRequests?: FriendshipCreateNestedManyWithoutRequesterInput
    receivedFriendRequests?: FriendshipCreateNestedManyWithoutReceiverInput
    gameParticipations?: GameParticipantCreateNestedManyWithoutUserInput
    dailyChallengeAnswers?: DailyChallengeAnswerCreateNestedManyWithoutUserInput
    leaderboardEntry?: LeaderboardCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPasswordResetTokensInput = {
    id?: string
    email: string
    username: string
    firstName: string
    lastName: string
    phone?: string | null
    avatar?: string | null
    status?: $Enums.UserStatus
    totalScore?: number
    gamesPlayed?: number
    gamesWon?: number
    winRate?: number
    currentStreak?: number
    bestStreak?: number
    lastActive?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: UserSessionUncheckedCreateNestedManyWithoutUserInput
    sentFriendRequests?: FriendshipUncheckedCreateNestedManyWithoutRequesterInput
    receivedFriendRequests?: FriendshipUncheckedCreateNestedManyWithoutReceiverInput
    gameParticipations?: GameParticipantUncheckedCreateNestedManyWithoutUserInput
    dailyChallengeAnswers?: DailyChallengeAnswerUncheckedCreateNestedManyWithoutUserInput
    leaderboardEntry?: LeaderboardUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPasswordResetTokensInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPasswordResetTokensInput, UserUncheckedCreateWithoutPasswordResetTokensInput>
  }

  export type UserUpsertWithoutPasswordResetTokensInput = {
    update: XOR<UserUpdateWithoutPasswordResetTokensInput, UserUncheckedUpdateWithoutPasswordResetTokensInput>
    create: XOR<UserCreateWithoutPasswordResetTokensInput, UserUncheckedCreateWithoutPasswordResetTokensInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPasswordResetTokensInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPasswordResetTokensInput, UserUncheckedUpdateWithoutPasswordResetTokensInput>
  }

  export type UserUpdateWithoutPasswordResetTokensInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    totalScore?: IntFieldUpdateOperationsInput | number
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    gamesWon?: IntFieldUpdateOperationsInput | number
    winRate?: FloatFieldUpdateOperationsInput | number
    currentStreak?: IntFieldUpdateOperationsInput | number
    bestStreak?: IntFieldUpdateOperationsInput | number
    lastActive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: UserSessionUpdateManyWithoutUserNestedInput
    sentFriendRequests?: FriendshipUpdateManyWithoutRequesterNestedInput
    receivedFriendRequests?: FriendshipUpdateManyWithoutReceiverNestedInput
    gameParticipations?: GameParticipantUpdateManyWithoutUserNestedInput
    dailyChallengeAnswers?: DailyChallengeAnswerUpdateManyWithoutUserNestedInput
    leaderboardEntry?: LeaderboardUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPasswordResetTokensInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    totalScore?: IntFieldUpdateOperationsInput | number
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    gamesWon?: IntFieldUpdateOperationsInput | number
    winRate?: FloatFieldUpdateOperationsInput | number
    currentStreak?: IntFieldUpdateOperationsInput | number
    bestStreak?: IntFieldUpdateOperationsInput | number
    lastActive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: UserSessionUncheckedUpdateManyWithoutUserNestedInput
    sentFriendRequests?: FriendshipUncheckedUpdateManyWithoutRequesterNestedInput
    receivedFriendRequests?: FriendshipUncheckedUpdateManyWithoutReceiverNestedInput
    gameParticipations?: GameParticipantUncheckedUpdateManyWithoutUserNestedInput
    dailyChallengeAnswers?: DailyChallengeAnswerUncheckedUpdateManyWithoutUserNestedInput
    leaderboardEntry?: LeaderboardUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateWithoutSessionsInput = {
    id?: string
    email: string
    username: string
    firstName: string
    lastName: string
    phone?: string | null
    avatar?: string | null
    status?: $Enums.UserStatus
    totalScore?: number
    gamesPlayed?: number
    gamesWon?: number
    winRate?: number
    currentStreak?: number
    bestStreak?: number
    lastActive?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    passwordResetTokens?: PasswordResetTokenCreateNestedManyWithoutUserInput
    sentFriendRequests?: FriendshipCreateNestedManyWithoutRequesterInput
    receivedFriendRequests?: FriendshipCreateNestedManyWithoutReceiverInput
    gameParticipations?: GameParticipantCreateNestedManyWithoutUserInput
    dailyChallengeAnswers?: DailyChallengeAnswerCreateNestedManyWithoutUserInput
    leaderboardEntry?: LeaderboardCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSessionsInput = {
    id?: string
    email: string
    username: string
    firstName: string
    lastName: string
    phone?: string | null
    avatar?: string | null
    status?: $Enums.UserStatus
    totalScore?: number
    gamesPlayed?: number
    gamesWon?: number
    winRate?: number
    currentStreak?: number
    bestStreak?: number
    lastActive?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    passwordResetTokens?: PasswordResetTokenUncheckedCreateNestedManyWithoutUserInput
    sentFriendRequests?: FriendshipUncheckedCreateNestedManyWithoutRequesterInput
    receivedFriendRequests?: FriendshipUncheckedCreateNestedManyWithoutReceiverInput
    gameParticipations?: GameParticipantUncheckedCreateNestedManyWithoutUserInput
    dailyChallengeAnswers?: DailyChallengeAnswerUncheckedCreateNestedManyWithoutUserInput
    leaderboardEntry?: LeaderboardUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
  }

  export type UserUpsertWithoutSessionsInput = {
    update: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
    create: XOR<UserCreateWithoutSessionsInput, UserUncheckedCreateWithoutSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSessionsInput, UserUncheckedUpdateWithoutSessionsInput>
  }

  export type UserUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    totalScore?: IntFieldUpdateOperationsInput | number
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    gamesWon?: IntFieldUpdateOperationsInput | number
    winRate?: FloatFieldUpdateOperationsInput | number
    currentStreak?: IntFieldUpdateOperationsInput | number
    bestStreak?: IntFieldUpdateOperationsInput | number
    lastActive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordResetTokens?: PasswordResetTokenUpdateManyWithoutUserNestedInput
    sentFriendRequests?: FriendshipUpdateManyWithoutRequesterNestedInput
    receivedFriendRequests?: FriendshipUpdateManyWithoutReceiverNestedInput
    gameParticipations?: GameParticipantUpdateManyWithoutUserNestedInput
    dailyChallengeAnswers?: DailyChallengeAnswerUpdateManyWithoutUserNestedInput
    leaderboardEntry?: LeaderboardUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    totalScore?: IntFieldUpdateOperationsInput | number
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    gamesWon?: IntFieldUpdateOperationsInput | number
    winRate?: FloatFieldUpdateOperationsInput | number
    currentStreak?: IntFieldUpdateOperationsInput | number
    bestStreak?: IntFieldUpdateOperationsInput | number
    lastActive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordResetTokens?: PasswordResetTokenUncheckedUpdateManyWithoutUserNestedInput
    sentFriendRequests?: FriendshipUncheckedUpdateManyWithoutRequesterNestedInput
    receivedFriendRequests?: FriendshipUncheckedUpdateManyWithoutReceiverNestedInput
    gameParticipations?: GameParticipantUncheckedUpdateManyWithoutUserNestedInput
    dailyChallengeAnswers?: DailyChallengeAnswerUncheckedUpdateManyWithoutUserNestedInput
    leaderboardEntry?: LeaderboardUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateWithoutSentFriendRequestsInput = {
    id?: string
    email: string
    username: string
    firstName: string
    lastName: string
    phone?: string | null
    avatar?: string | null
    status?: $Enums.UserStatus
    totalScore?: number
    gamesPlayed?: number
    gamesWon?: number
    winRate?: number
    currentStreak?: number
    bestStreak?: number
    lastActive?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: UserSessionCreateNestedManyWithoutUserInput
    passwordResetTokens?: PasswordResetTokenCreateNestedManyWithoutUserInput
    receivedFriendRequests?: FriendshipCreateNestedManyWithoutReceiverInput
    gameParticipations?: GameParticipantCreateNestedManyWithoutUserInput
    dailyChallengeAnswers?: DailyChallengeAnswerCreateNestedManyWithoutUserInput
    leaderboardEntry?: LeaderboardCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSentFriendRequestsInput = {
    id?: string
    email: string
    username: string
    firstName: string
    lastName: string
    phone?: string | null
    avatar?: string | null
    status?: $Enums.UserStatus
    totalScore?: number
    gamesPlayed?: number
    gamesWon?: number
    winRate?: number
    currentStreak?: number
    bestStreak?: number
    lastActive?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: UserSessionUncheckedCreateNestedManyWithoutUserInput
    passwordResetTokens?: PasswordResetTokenUncheckedCreateNestedManyWithoutUserInput
    receivedFriendRequests?: FriendshipUncheckedCreateNestedManyWithoutReceiverInput
    gameParticipations?: GameParticipantUncheckedCreateNestedManyWithoutUserInput
    dailyChallengeAnswers?: DailyChallengeAnswerUncheckedCreateNestedManyWithoutUserInput
    leaderboardEntry?: LeaderboardUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSentFriendRequestsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSentFriendRequestsInput, UserUncheckedCreateWithoutSentFriendRequestsInput>
  }

  export type UserCreateWithoutReceivedFriendRequestsInput = {
    id?: string
    email: string
    username: string
    firstName: string
    lastName: string
    phone?: string | null
    avatar?: string | null
    status?: $Enums.UserStatus
    totalScore?: number
    gamesPlayed?: number
    gamesWon?: number
    winRate?: number
    currentStreak?: number
    bestStreak?: number
    lastActive?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: UserSessionCreateNestedManyWithoutUserInput
    passwordResetTokens?: PasswordResetTokenCreateNestedManyWithoutUserInput
    sentFriendRequests?: FriendshipCreateNestedManyWithoutRequesterInput
    gameParticipations?: GameParticipantCreateNestedManyWithoutUserInput
    dailyChallengeAnswers?: DailyChallengeAnswerCreateNestedManyWithoutUserInput
    leaderboardEntry?: LeaderboardCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutReceivedFriendRequestsInput = {
    id?: string
    email: string
    username: string
    firstName: string
    lastName: string
    phone?: string | null
    avatar?: string | null
    status?: $Enums.UserStatus
    totalScore?: number
    gamesPlayed?: number
    gamesWon?: number
    winRate?: number
    currentStreak?: number
    bestStreak?: number
    lastActive?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: UserSessionUncheckedCreateNestedManyWithoutUserInput
    passwordResetTokens?: PasswordResetTokenUncheckedCreateNestedManyWithoutUserInput
    sentFriendRequests?: FriendshipUncheckedCreateNestedManyWithoutRequesterInput
    gameParticipations?: GameParticipantUncheckedCreateNestedManyWithoutUserInput
    dailyChallengeAnswers?: DailyChallengeAnswerUncheckedCreateNestedManyWithoutUserInput
    leaderboardEntry?: LeaderboardUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutReceivedFriendRequestsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutReceivedFriendRequestsInput, UserUncheckedCreateWithoutReceivedFriendRequestsInput>
  }

  export type UserUpsertWithoutSentFriendRequestsInput = {
    update: XOR<UserUpdateWithoutSentFriendRequestsInput, UserUncheckedUpdateWithoutSentFriendRequestsInput>
    create: XOR<UserCreateWithoutSentFriendRequestsInput, UserUncheckedCreateWithoutSentFriendRequestsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSentFriendRequestsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSentFriendRequestsInput, UserUncheckedUpdateWithoutSentFriendRequestsInput>
  }

  export type UserUpdateWithoutSentFriendRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    totalScore?: IntFieldUpdateOperationsInput | number
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    gamesWon?: IntFieldUpdateOperationsInput | number
    winRate?: FloatFieldUpdateOperationsInput | number
    currentStreak?: IntFieldUpdateOperationsInput | number
    bestStreak?: IntFieldUpdateOperationsInput | number
    lastActive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: UserSessionUpdateManyWithoutUserNestedInput
    passwordResetTokens?: PasswordResetTokenUpdateManyWithoutUserNestedInput
    receivedFriendRequests?: FriendshipUpdateManyWithoutReceiverNestedInput
    gameParticipations?: GameParticipantUpdateManyWithoutUserNestedInput
    dailyChallengeAnswers?: DailyChallengeAnswerUpdateManyWithoutUserNestedInput
    leaderboardEntry?: LeaderboardUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSentFriendRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    totalScore?: IntFieldUpdateOperationsInput | number
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    gamesWon?: IntFieldUpdateOperationsInput | number
    winRate?: FloatFieldUpdateOperationsInput | number
    currentStreak?: IntFieldUpdateOperationsInput | number
    bestStreak?: IntFieldUpdateOperationsInput | number
    lastActive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: UserSessionUncheckedUpdateManyWithoutUserNestedInput
    passwordResetTokens?: PasswordResetTokenUncheckedUpdateManyWithoutUserNestedInput
    receivedFriendRequests?: FriendshipUncheckedUpdateManyWithoutReceiverNestedInput
    gameParticipations?: GameParticipantUncheckedUpdateManyWithoutUserNestedInput
    dailyChallengeAnswers?: DailyChallengeAnswerUncheckedUpdateManyWithoutUserNestedInput
    leaderboardEntry?: LeaderboardUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserUpsertWithoutReceivedFriendRequestsInput = {
    update: XOR<UserUpdateWithoutReceivedFriendRequestsInput, UserUncheckedUpdateWithoutReceivedFriendRequestsInput>
    create: XOR<UserCreateWithoutReceivedFriendRequestsInput, UserUncheckedCreateWithoutReceivedFriendRequestsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutReceivedFriendRequestsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutReceivedFriendRequestsInput, UserUncheckedUpdateWithoutReceivedFriendRequestsInput>
  }

  export type UserUpdateWithoutReceivedFriendRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    totalScore?: IntFieldUpdateOperationsInput | number
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    gamesWon?: IntFieldUpdateOperationsInput | number
    winRate?: FloatFieldUpdateOperationsInput | number
    currentStreak?: IntFieldUpdateOperationsInput | number
    bestStreak?: IntFieldUpdateOperationsInput | number
    lastActive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: UserSessionUpdateManyWithoutUserNestedInput
    passwordResetTokens?: PasswordResetTokenUpdateManyWithoutUserNestedInput
    sentFriendRequests?: FriendshipUpdateManyWithoutRequesterNestedInput
    gameParticipations?: GameParticipantUpdateManyWithoutUserNestedInput
    dailyChallengeAnswers?: DailyChallengeAnswerUpdateManyWithoutUserNestedInput
    leaderboardEntry?: LeaderboardUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutReceivedFriendRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    totalScore?: IntFieldUpdateOperationsInput | number
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    gamesWon?: IntFieldUpdateOperationsInput | number
    winRate?: FloatFieldUpdateOperationsInput | number
    currentStreak?: IntFieldUpdateOperationsInput | number
    bestStreak?: IntFieldUpdateOperationsInput | number
    lastActive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: UserSessionUncheckedUpdateManyWithoutUserNestedInput
    passwordResetTokens?: PasswordResetTokenUncheckedUpdateManyWithoutUserNestedInput
    sentFriendRequests?: FriendshipUncheckedUpdateManyWithoutRequesterNestedInput
    gameParticipations?: GameParticipantUncheckedUpdateManyWithoutUserNestedInput
    dailyChallengeAnswers?: DailyChallengeAnswerUncheckedUpdateManyWithoutUserNestedInput
    leaderboardEntry?: LeaderboardUncheckedUpdateOneWithoutUserNestedInput
  }

  export type GameParticipantCreateWithoutGameSessionInput = {
    id?: string
    position?: number
    isReady?: boolean
    isConnected?: boolean
    finalScore?: number
    finalRank?: number | null
    mistakeCount?: number
    joinedAt?: Date | string
    leftAt?: Date | string | null
    user: UserCreateNestedOneWithoutGameParticipationsInput
    scores?: GameScoreCreateNestedManyWithoutParticipantInput
  }

  export type GameParticipantUncheckedCreateWithoutGameSessionInput = {
    id?: string
    userId: string
    position?: number
    isReady?: boolean
    isConnected?: boolean
    finalScore?: number
    finalRank?: number | null
    mistakeCount?: number
    joinedAt?: Date | string
    leftAt?: Date | string | null
    scores?: GameScoreUncheckedCreateNestedManyWithoutParticipantInput
  }

  export type GameParticipantCreateOrConnectWithoutGameSessionInput = {
    where: GameParticipantWhereUniqueInput
    create: XOR<GameParticipantCreateWithoutGameSessionInput, GameParticipantUncheckedCreateWithoutGameSessionInput>
  }

  export type GameParticipantCreateManyGameSessionInputEnvelope = {
    data: GameParticipantCreateManyGameSessionInput | GameParticipantCreateManyGameSessionInput[]
    skipDuplicates?: boolean
  }

  export type GameRoundCreateWithoutGameSessionInput = {
    id?: string
    roundNumber: number
    verse: string
    blanks: JsonNullValueInput | InputJsonValue
    emojiMapping: JsonNullValueInput | InputJsonValue
    correctBook: string
    correctRef: string
    context?: string | null
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    scores?: GameScoreCreateNestedManyWithoutRoundInput
  }

  export type GameRoundUncheckedCreateWithoutGameSessionInput = {
    id?: string
    roundNumber: number
    verse: string
    blanks: JsonNullValueInput | InputJsonValue
    emojiMapping: JsonNullValueInput | InputJsonValue
    correctBook: string
    correctRef: string
    context?: string | null
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    scores?: GameScoreUncheckedCreateNestedManyWithoutRoundInput
  }

  export type GameRoundCreateOrConnectWithoutGameSessionInput = {
    where: GameRoundWhereUniqueInput
    create: XOR<GameRoundCreateWithoutGameSessionInput, GameRoundUncheckedCreateWithoutGameSessionInput>
  }

  export type GameRoundCreateManyGameSessionInputEnvelope = {
    data: GameRoundCreateManyGameSessionInput | GameRoundCreateManyGameSessionInput[]
    skipDuplicates?: boolean
  }

  export type GameParticipantUpsertWithWhereUniqueWithoutGameSessionInput = {
    where: GameParticipantWhereUniqueInput
    update: XOR<GameParticipantUpdateWithoutGameSessionInput, GameParticipantUncheckedUpdateWithoutGameSessionInput>
    create: XOR<GameParticipantCreateWithoutGameSessionInput, GameParticipantUncheckedCreateWithoutGameSessionInput>
  }

  export type GameParticipantUpdateWithWhereUniqueWithoutGameSessionInput = {
    where: GameParticipantWhereUniqueInput
    data: XOR<GameParticipantUpdateWithoutGameSessionInput, GameParticipantUncheckedUpdateWithoutGameSessionInput>
  }

  export type GameParticipantUpdateManyWithWhereWithoutGameSessionInput = {
    where: GameParticipantScalarWhereInput
    data: XOR<GameParticipantUpdateManyMutationInput, GameParticipantUncheckedUpdateManyWithoutGameSessionInput>
  }

  export type GameRoundUpsertWithWhereUniqueWithoutGameSessionInput = {
    where: GameRoundWhereUniqueInput
    update: XOR<GameRoundUpdateWithoutGameSessionInput, GameRoundUncheckedUpdateWithoutGameSessionInput>
    create: XOR<GameRoundCreateWithoutGameSessionInput, GameRoundUncheckedCreateWithoutGameSessionInput>
  }

  export type GameRoundUpdateWithWhereUniqueWithoutGameSessionInput = {
    where: GameRoundWhereUniqueInput
    data: XOR<GameRoundUpdateWithoutGameSessionInput, GameRoundUncheckedUpdateWithoutGameSessionInput>
  }

  export type GameRoundUpdateManyWithWhereWithoutGameSessionInput = {
    where: GameRoundScalarWhereInput
    data: XOR<GameRoundUpdateManyMutationInput, GameRoundUncheckedUpdateManyWithoutGameSessionInput>
  }

  export type GameRoundScalarWhereInput = {
    AND?: GameRoundScalarWhereInput | GameRoundScalarWhereInput[]
    OR?: GameRoundScalarWhereInput[]
    NOT?: GameRoundScalarWhereInput | GameRoundScalarWhereInput[]
    id?: UuidFilter<"GameRound"> | string
    gameSessionId?: UuidFilter<"GameRound"> | string
    roundNumber?: IntFilter<"GameRound"> | number
    verse?: StringFilter<"GameRound"> | string
    blanks?: JsonFilter<"GameRound">
    emojiMapping?: JsonFilter<"GameRound">
    correctBook?: StringFilter<"GameRound"> | string
    correctRef?: StringFilter<"GameRound"> | string
    context?: StringNullableFilter<"GameRound"> | string | null
    startedAt?: DateTimeNullableFilter<"GameRound"> | Date | string | null
    endedAt?: DateTimeNullableFilter<"GameRound"> | Date | string | null
  }

  export type GameSessionCreateWithoutParticipantsInput = {
    id?: string
    roomCode?: string | null
    gameType: $Enums.GameType
    status?: $Enums.GameStatus
    maxPlayers?: number
    currentRound?: number
    totalRounds?: number
    maxMistakes?: number
    difficulty?: string
    timeLimit?: number | null
    createdAt?: Date | string
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    updatedAt?: Date | string
    rounds?: GameRoundCreateNestedManyWithoutGameSessionInput
  }

  export type GameSessionUncheckedCreateWithoutParticipantsInput = {
    id?: string
    roomCode?: string | null
    gameType: $Enums.GameType
    status?: $Enums.GameStatus
    maxPlayers?: number
    currentRound?: number
    totalRounds?: number
    maxMistakes?: number
    difficulty?: string
    timeLimit?: number | null
    createdAt?: Date | string
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    updatedAt?: Date | string
    rounds?: GameRoundUncheckedCreateNestedManyWithoutGameSessionInput
  }

  export type GameSessionCreateOrConnectWithoutParticipantsInput = {
    where: GameSessionWhereUniqueInput
    create: XOR<GameSessionCreateWithoutParticipantsInput, GameSessionUncheckedCreateWithoutParticipantsInput>
  }

  export type UserCreateWithoutGameParticipationsInput = {
    id?: string
    email: string
    username: string
    firstName: string
    lastName: string
    phone?: string | null
    avatar?: string | null
    status?: $Enums.UserStatus
    totalScore?: number
    gamesPlayed?: number
    gamesWon?: number
    winRate?: number
    currentStreak?: number
    bestStreak?: number
    lastActive?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: UserSessionCreateNestedManyWithoutUserInput
    passwordResetTokens?: PasswordResetTokenCreateNestedManyWithoutUserInput
    sentFriendRequests?: FriendshipCreateNestedManyWithoutRequesterInput
    receivedFriendRequests?: FriendshipCreateNestedManyWithoutReceiverInput
    dailyChallengeAnswers?: DailyChallengeAnswerCreateNestedManyWithoutUserInput
    leaderboardEntry?: LeaderboardCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutGameParticipationsInput = {
    id?: string
    email: string
    username: string
    firstName: string
    lastName: string
    phone?: string | null
    avatar?: string | null
    status?: $Enums.UserStatus
    totalScore?: number
    gamesPlayed?: number
    gamesWon?: number
    winRate?: number
    currentStreak?: number
    bestStreak?: number
    lastActive?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: UserSessionUncheckedCreateNestedManyWithoutUserInput
    passwordResetTokens?: PasswordResetTokenUncheckedCreateNestedManyWithoutUserInput
    sentFriendRequests?: FriendshipUncheckedCreateNestedManyWithoutRequesterInput
    receivedFriendRequests?: FriendshipUncheckedCreateNestedManyWithoutReceiverInput
    dailyChallengeAnswers?: DailyChallengeAnswerUncheckedCreateNestedManyWithoutUserInput
    leaderboardEntry?: LeaderboardUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutGameParticipationsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutGameParticipationsInput, UserUncheckedCreateWithoutGameParticipationsInput>
  }

  export type GameScoreCreateWithoutParticipantInput = {
    id?: string
    blanksScore?: number
    contextScore?: number
    bookScore?: number
    referenceScore?: number
    timeBonus?: number
    streakBonus?: number
    totalScore?: number
    timeSpent: number
    mistakesMade?: number
    hintsUsed?: number
    createdAt?: Date | string
    round: GameRoundCreateNestedOneWithoutScoresInput
  }

  export type GameScoreUncheckedCreateWithoutParticipantInput = {
    id?: string
    roundId: string
    blanksScore?: number
    contextScore?: number
    bookScore?: number
    referenceScore?: number
    timeBonus?: number
    streakBonus?: number
    totalScore?: number
    timeSpent: number
    mistakesMade?: number
    hintsUsed?: number
    createdAt?: Date | string
  }

  export type GameScoreCreateOrConnectWithoutParticipantInput = {
    where: GameScoreWhereUniqueInput
    create: XOR<GameScoreCreateWithoutParticipantInput, GameScoreUncheckedCreateWithoutParticipantInput>
  }

  export type GameScoreCreateManyParticipantInputEnvelope = {
    data: GameScoreCreateManyParticipantInput | GameScoreCreateManyParticipantInput[]
    skipDuplicates?: boolean
  }

  export type GameSessionUpsertWithoutParticipantsInput = {
    update: XOR<GameSessionUpdateWithoutParticipantsInput, GameSessionUncheckedUpdateWithoutParticipantsInput>
    create: XOR<GameSessionCreateWithoutParticipantsInput, GameSessionUncheckedCreateWithoutParticipantsInput>
    where?: GameSessionWhereInput
  }

  export type GameSessionUpdateToOneWithWhereWithoutParticipantsInput = {
    where?: GameSessionWhereInput
    data: XOR<GameSessionUpdateWithoutParticipantsInput, GameSessionUncheckedUpdateWithoutParticipantsInput>
  }

  export type GameSessionUpdateWithoutParticipantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomCode?: NullableStringFieldUpdateOperationsInput | string | null
    gameType?: EnumGameTypeFieldUpdateOperationsInput | $Enums.GameType
    status?: EnumGameStatusFieldUpdateOperationsInput | $Enums.GameStatus
    maxPlayers?: IntFieldUpdateOperationsInput | number
    currentRound?: IntFieldUpdateOperationsInput | number
    totalRounds?: IntFieldUpdateOperationsInput | number
    maxMistakes?: IntFieldUpdateOperationsInput | number
    difficulty?: StringFieldUpdateOperationsInput | string
    timeLimit?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rounds?: GameRoundUpdateManyWithoutGameSessionNestedInput
  }

  export type GameSessionUncheckedUpdateWithoutParticipantsInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomCode?: NullableStringFieldUpdateOperationsInput | string | null
    gameType?: EnumGameTypeFieldUpdateOperationsInput | $Enums.GameType
    status?: EnumGameStatusFieldUpdateOperationsInput | $Enums.GameStatus
    maxPlayers?: IntFieldUpdateOperationsInput | number
    currentRound?: IntFieldUpdateOperationsInput | number
    totalRounds?: IntFieldUpdateOperationsInput | number
    maxMistakes?: IntFieldUpdateOperationsInput | number
    difficulty?: StringFieldUpdateOperationsInput | string
    timeLimit?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    rounds?: GameRoundUncheckedUpdateManyWithoutGameSessionNestedInput
  }

  export type UserUpsertWithoutGameParticipationsInput = {
    update: XOR<UserUpdateWithoutGameParticipationsInput, UserUncheckedUpdateWithoutGameParticipationsInput>
    create: XOR<UserCreateWithoutGameParticipationsInput, UserUncheckedCreateWithoutGameParticipationsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutGameParticipationsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutGameParticipationsInput, UserUncheckedUpdateWithoutGameParticipationsInput>
  }

  export type UserUpdateWithoutGameParticipationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    totalScore?: IntFieldUpdateOperationsInput | number
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    gamesWon?: IntFieldUpdateOperationsInput | number
    winRate?: FloatFieldUpdateOperationsInput | number
    currentStreak?: IntFieldUpdateOperationsInput | number
    bestStreak?: IntFieldUpdateOperationsInput | number
    lastActive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: UserSessionUpdateManyWithoutUserNestedInput
    passwordResetTokens?: PasswordResetTokenUpdateManyWithoutUserNestedInput
    sentFriendRequests?: FriendshipUpdateManyWithoutRequesterNestedInput
    receivedFriendRequests?: FriendshipUpdateManyWithoutReceiverNestedInput
    dailyChallengeAnswers?: DailyChallengeAnswerUpdateManyWithoutUserNestedInput
    leaderboardEntry?: LeaderboardUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutGameParticipationsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    totalScore?: IntFieldUpdateOperationsInput | number
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    gamesWon?: IntFieldUpdateOperationsInput | number
    winRate?: FloatFieldUpdateOperationsInput | number
    currentStreak?: IntFieldUpdateOperationsInput | number
    bestStreak?: IntFieldUpdateOperationsInput | number
    lastActive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: UserSessionUncheckedUpdateManyWithoutUserNestedInput
    passwordResetTokens?: PasswordResetTokenUncheckedUpdateManyWithoutUserNestedInput
    sentFriendRequests?: FriendshipUncheckedUpdateManyWithoutRequesterNestedInput
    receivedFriendRequests?: FriendshipUncheckedUpdateManyWithoutReceiverNestedInput
    dailyChallengeAnswers?: DailyChallengeAnswerUncheckedUpdateManyWithoutUserNestedInput
    leaderboardEntry?: LeaderboardUncheckedUpdateOneWithoutUserNestedInput
  }

  export type GameScoreUpsertWithWhereUniqueWithoutParticipantInput = {
    where: GameScoreWhereUniqueInput
    update: XOR<GameScoreUpdateWithoutParticipantInput, GameScoreUncheckedUpdateWithoutParticipantInput>
    create: XOR<GameScoreCreateWithoutParticipantInput, GameScoreUncheckedCreateWithoutParticipantInput>
  }

  export type GameScoreUpdateWithWhereUniqueWithoutParticipantInput = {
    where: GameScoreWhereUniqueInput
    data: XOR<GameScoreUpdateWithoutParticipantInput, GameScoreUncheckedUpdateWithoutParticipantInput>
  }

  export type GameScoreUpdateManyWithWhereWithoutParticipantInput = {
    where: GameScoreScalarWhereInput
    data: XOR<GameScoreUpdateManyMutationInput, GameScoreUncheckedUpdateManyWithoutParticipantInput>
  }

  export type GameScoreScalarWhereInput = {
    AND?: GameScoreScalarWhereInput | GameScoreScalarWhereInput[]
    OR?: GameScoreScalarWhereInput[]
    NOT?: GameScoreScalarWhereInput | GameScoreScalarWhereInput[]
    id?: UuidFilter<"GameScore"> | string
    participantId?: UuidFilter<"GameScore"> | string
    roundId?: UuidFilter<"GameScore"> | string
    blanksScore?: IntFilter<"GameScore"> | number
    contextScore?: IntFilter<"GameScore"> | number
    bookScore?: IntFilter<"GameScore"> | number
    referenceScore?: IntFilter<"GameScore"> | number
    timeBonus?: IntFilter<"GameScore"> | number
    streakBonus?: IntFilter<"GameScore"> | number
    totalScore?: IntFilter<"GameScore"> | number
    timeSpent?: IntFilter<"GameScore"> | number
    mistakesMade?: IntFilter<"GameScore"> | number
    hintsUsed?: IntFilter<"GameScore"> | number
    createdAt?: DateTimeFilter<"GameScore"> | Date | string
  }

  export type GameSessionCreateWithoutRoundsInput = {
    id?: string
    roomCode?: string | null
    gameType: $Enums.GameType
    status?: $Enums.GameStatus
    maxPlayers?: number
    currentRound?: number
    totalRounds?: number
    maxMistakes?: number
    difficulty?: string
    timeLimit?: number | null
    createdAt?: Date | string
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    updatedAt?: Date | string
    participants?: GameParticipantCreateNestedManyWithoutGameSessionInput
  }

  export type GameSessionUncheckedCreateWithoutRoundsInput = {
    id?: string
    roomCode?: string | null
    gameType: $Enums.GameType
    status?: $Enums.GameStatus
    maxPlayers?: number
    currentRound?: number
    totalRounds?: number
    maxMistakes?: number
    difficulty?: string
    timeLimit?: number | null
    createdAt?: Date | string
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    updatedAt?: Date | string
    participants?: GameParticipantUncheckedCreateNestedManyWithoutGameSessionInput
  }

  export type GameSessionCreateOrConnectWithoutRoundsInput = {
    where: GameSessionWhereUniqueInput
    create: XOR<GameSessionCreateWithoutRoundsInput, GameSessionUncheckedCreateWithoutRoundsInput>
  }

  export type GameScoreCreateWithoutRoundInput = {
    id?: string
    blanksScore?: number
    contextScore?: number
    bookScore?: number
    referenceScore?: number
    timeBonus?: number
    streakBonus?: number
    totalScore?: number
    timeSpent: number
    mistakesMade?: number
    hintsUsed?: number
    createdAt?: Date | string
    participant: GameParticipantCreateNestedOneWithoutScoresInput
  }

  export type GameScoreUncheckedCreateWithoutRoundInput = {
    id?: string
    participantId: string
    blanksScore?: number
    contextScore?: number
    bookScore?: number
    referenceScore?: number
    timeBonus?: number
    streakBonus?: number
    totalScore?: number
    timeSpent: number
    mistakesMade?: number
    hintsUsed?: number
    createdAt?: Date | string
  }

  export type GameScoreCreateOrConnectWithoutRoundInput = {
    where: GameScoreWhereUniqueInput
    create: XOR<GameScoreCreateWithoutRoundInput, GameScoreUncheckedCreateWithoutRoundInput>
  }

  export type GameScoreCreateManyRoundInputEnvelope = {
    data: GameScoreCreateManyRoundInput | GameScoreCreateManyRoundInput[]
    skipDuplicates?: boolean
  }

  export type GameSessionUpsertWithoutRoundsInput = {
    update: XOR<GameSessionUpdateWithoutRoundsInput, GameSessionUncheckedUpdateWithoutRoundsInput>
    create: XOR<GameSessionCreateWithoutRoundsInput, GameSessionUncheckedCreateWithoutRoundsInput>
    where?: GameSessionWhereInput
  }

  export type GameSessionUpdateToOneWithWhereWithoutRoundsInput = {
    where?: GameSessionWhereInput
    data: XOR<GameSessionUpdateWithoutRoundsInput, GameSessionUncheckedUpdateWithoutRoundsInput>
  }

  export type GameSessionUpdateWithoutRoundsInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomCode?: NullableStringFieldUpdateOperationsInput | string | null
    gameType?: EnumGameTypeFieldUpdateOperationsInput | $Enums.GameType
    status?: EnumGameStatusFieldUpdateOperationsInput | $Enums.GameStatus
    maxPlayers?: IntFieldUpdateOperationsInput | number
    currentRound?: IntFieldUpdateOperationsInput | number
    totalRounds?: IntFieldUpdateOperationsInput | number
    maxMistakes?: IntFieldUpdateOperationsInput | number
    difficulty?: StringFieldUpdateOperationsInput | string
    timeLimit?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: GameParticipantUpdateManyWithoutGameSessionNestedInput
  }

  export type GameSessionUncheckedUpdateWithoutRoundsInput = {
    id?: StringFieldUpdateOperationsInput | string
    roomCode?: NullableStringFieldUpdateOperationsInput | string | null
    gameType?: EnumGameTypeFieldUpdateOperationsInput | $Enums.GameType
    status?: EnumGameStatusFieldUpdateOperationsInput | $Enums.GameStatus
    maxPlayers?: IntFieldUpdateOperationsInput | number
    currentRound?: IntFieldUpdateOperationsInput | number
    totalRounds?: IntFieldUpdateOperationsInput | number
    maxMistakes?: IntFieldUpdateOperationsInput | number
    difficulty?: StringFieldUpdateOperationsInput | string
    timeLimit?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participants?: GameParticipantUncheckedUpdateManyWithoutGameSessionNestedInput
  }

  export type GameScoreUpsertWithWhereUniqueWithoutRoundInput = {
    where: GameScoreWhereUniqueInput
    update: XOR<GameScoreUpdateWithoutRoundInput, GameScoreUncheckedUpdateWithoutRoundInput>
    create: XOR<GameScoreCreateWithoutRoundInput, GameScoreUncheckedCreateWithoutRoundInput>
  }

  export type GameScoreUpdateWithWhereUniqueWithoutRoundInput = {
    where: GameScoreWhereUniqueInput
    data: XOR<GameScoreUpdateWithoutRoundInput, GameScoreUncheckedUpdateWithoutRoundInput>
  }

  export type GameScoreUpdateManyWithWhereWithoutRoundInput = {
    where: GameScoreScalarWhereInput
    data: XOR<GameScoreUpdateManyMutationInput, GameScoreUncheckedUpdateManyWithoutRoundInput>
  }

  export type GameParticipantCreateWithoutScoresInput = {
    id?: string
    position?: number
    isReady?: boolean
    isConnected?: boolean
    finalScore?: number
    finalRank?: number | null
    mistakeCount?: number
    joinedAt?: Date | string
    leftAt?: Date | string | null
    gameSession: GameSessionCreateNestedOneWithoutParticipantsInput
    user: UserCreateNestedOneWithoutGameParticipationsInput
  }

  export type GameParticipantUncheckedCreateWithoutScoresInput = {
    id?: string
    gameSessionId: string
    userId: string
    position?: number
    isReady?: boolean
    isConnected?: boolean
    finalScore?: number
    finalRank?: number | null
    mistakeCount?: number
    joinedAt?: Date | string
    leftAt?: Date | string | null
  }

  export type GameParticipantCreateOrConnectWithoutScoresInput = {
    where: GameParticipantWhereUniqueInput
    create: XOR<GameParticipantCreateWithoutScoresInput, GameParticipantUncheckedCreateWithoutScoresInput>
  }

  export type GameRoundCreateWithoutScoresInput = {
    id?: string
    roundNumber: number
    verse: string
    blanks: JsonNullValueInput | InputJsonValue
    emojiMapping: JsonNullValueInput | InputJsonValue
    correctBook: string
    correctRef: string
    context?: string | null
    startedAt?: Date | string | null
    endedAt?: Date | string | null
    gameSession: GameSessionCreateNestedOneWithoutRoundsInput
  }

  export type GameRoundUncheckedCreateWithoutScoresInput = {
    id?: string
    gameSessionId: string
    roundNumber: number
    verse: string
    blanks: JsonNullValueInput | InputJsonValue
    emojiMapping: JsonNullValueInput | InputJsonValue
    correctBook: string
    correctRef: string
    context?: string | null
    startedAt?: Date | string | null
    endedAt?: Date | string | null
  }

  export type GameRoundCreateOrConnectWithoutScoresInput = {
    where: GameRoundWhereUniqueInput
    create: XOR<GameRoundCreateWithoutScoresInput, GameRoundUncheckedCreateWithoutScoresInput>
  }

  export type GameParticipantUpsertWithoutScoresInput = {
    update: XOR<GameParticipantUpdateWithoutScoresInput, GameParticipantUncheckedUpdateWithoutScoresInput>
    create: XOR<GameParticipantCreateWithoutScoresInput, GameParticipantUncheckedCreateWithoutScoresInput>
    where?: GameParticipantWhereInput
  }

  export type GameParticipantUpdateToOneWithWhereWithoutScoresInput = {
    where?: GameParticipantWhereInput
    data: XOR<GameParticipantUpdateWithoutScoresInput, GameParticipantUncheckedUpdateWithoutScoresInput>
  }

  export type GameParticipantUpdateWithoutScoresInput = {
    id?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    isReady?: BoolFieldUpdateOperationsInput | boolean
    isConnected?: BoolFieldUpdateOperationsInput | boolean
    finalScore?: IntFieldUpdateOperationsInput | number
    finalRank?: NullableIntFieldUpdateOperationsInput | number | null
    mistakeCount?: IntFieldUpdateOperationsInput | number
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gameSession?: GameSessionUpdateOneRequiredWithoutParticipantsNestedInput
    user?: UserUpdateOneRequiredWithoutGameParticipationsNestedInput
  }

  export type GameParticipantUncheckedUpdateWithoutScoresInput = {
    id?: StringFieldUpdateOperationsInput | string
    gameSessionId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    isReady?: BoolFieldUpdateOperationsInput | boolean
    isConnected?: BoolFieldUpdateOperationsInput | boolean
    finalScore?: IntFieldUpdateOperationsInput | number
    finalRank?: NullableIntFieldUpdateOperationsInput | number | null
    mistakeCount?: IntFieldUpdateOperationsInput | number
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GameRoundUpsertWithoutScoresInput = {
    update: XOR<GameRoundUpdateWithoutScoresInput, GameRoundUncheckedUpdateWithoutScoresInput>
    create: XOR<GameRoundCreateWithoutScoresInput, GameRoundUncheckedCreateWithoutScoresInput>
    where?: GameRoundWhereInput
  }

  export type GameRoundUpdateToOneWithWhereWithoutScoresInput = {
    where?: GameRoundWhereInput
    data: XOR<GameRoundUpdateWithoutScoresInput, GameRoundUncheckedUpdateWithoutScoresInput>
  }

  export type GameRoundUpdateWithoutScoresInput = {
    id?: StringFieldUpdateOperationsInput | string
    roundNumber?: IntFieldUpdateOperationsInput | number
    verse?: StringFieldUpdateOperationsInput | string
    blanks?: JsonNullValueInput | InputJsonValue
    emojiMapping?: JsonNullValueInput | InputJsonValue
    correctBook?: StringFieldUpdateOperationsInput | string
    correctRef?: StringFieldUpdateOperationsInput | string
    context?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gameSession?: GameSessionUpdateOneRequiredWithoutRoundsNestedInput
  }

  export type GameRoundUncheckedUpdateWithoutScoresInput = {
    id?: StringFieldUpdateOperationsInput | string
    gameSessionId?: StringFieldUpdateOperationsInput | string
    roundNumber?: IntFieldUpdateOperationsInput | number
    verse?: StringFieldUpdateOperationsInput | string
    blanks?: JsonNullValueInput | InputJsonValue
    emojiMapping?: JsonNullValueInput | InputJsonValue
    correctBook?: StringFieldUpdateOperationsInput | string
    correctRef?: StringFieldUpdateOperationsInput | string
    context?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type DailyChallengeAnswerCreateWithoutChallengeInput = {
    id?: string
    userAnswers: JsonNullValueInput | InputJsonValue
    isCorrect?: boolean
    score?: number
    timeSpent: number
    hintsUsed?: number
    completedAt?: Date | string
    user: UserCreateNestedOneWithoutDailyChallengeAnswersInput
  }

  export type DailyChallengeAnswerUncheckedCreateWithoutChallengeInput = {
    id?: string
    userId: string
    userAnswers: JsonNullValueInput | InputJsonValue
    isCorrect?: boolean
    score?: number
    timeSpent: number
    hintsUsed?: number
    completedAt?: Date | string
  }

  export type DailyChallengeAnswerCreateOrConnectWithoutChallengeInput = {
    where: DailyChallengeAnswerWhereUniqueInput
    create: XOR<DailyChallengeAnswerCreateWithoutChallengeInput, DailyChallengeAnswerUncheckedCreateWithoutChallengeInput>
  }

  export type DailyChallengeAnswerCreateManyChallengeInputEnvelope = {
    data: DailyChallengeAnswerCreateManyChallengeInput | DailyChallengeAnswerCreateManyChallengeInput[]
    skipDuplicates?: boolean
  }

  export type DailyChallengeAnswerUpsertWithWhereUniqueWithoutChallengeInput = {
    where: DailyChallengeAnswerWhereUniqueInput
    update: XOR<DailyChallengeAnswerUpdateWithoutChallengeInput, DailyChallengeAnswerUncheckedUpdateWithoutChallengeInput>
    create: XOR<DailyChallengeAnswerCreateWithoutChallengeInput, DailyChallengeAnswerUncheckedCreateWithoutChallengeInput>
  }

  export type DailyChallengeAnswerUpdateWithWhereUniqueWithoutChallengeInput = {
    where: DailyChallengeAnswerWhereUniqueInput
    data: XOR<DailyChallengeAnswerUpdateWithoutChallengeInput, DailyChallengeAnswerUncheckedUpdateWithoutChallengeInput>
  }

  export type DailyChallengeAnswerUpdateManyWithWhereWithoutChallengeInput = {
    where: DailyChallengeAnswerScalarWhereInput
    data: XOR<DailyChallengeAnswerUpdateManyMutationInput, DailyChallengeAnswerUncheckedUpdateManyWithoutChallengeInput>
  }

  export type DailyChallengeCreateWithoutAnswersInput = {
    id?: string
    date: Date | string
    verse: string
    blanks: JsonNullValueInput | InputJsonValue
    emojiMapping: JsonNullValueInput | InputJsonValue
    correctBook: string
    correctRef: string
    context?: string | null
    difficulty?: string
    maxAttempts?: number
    timeLimit?: number | null
    isActive?: boolean
    createdAt?: Date | string
  }

  export type DailyChallengeUncheckedCreateWithoutAnswersInput = {
    id?: string
    date: Date | string
    verse: string
    blanks: JsonNullValueInput | InputJsonValue
    emojiMapping: JsonNullValueInput | InputJsonValue
    correctBook: string
    correctRef: string
    context?: string | null
    difficulty?: string
    maxAttempts?: number
    timeLimit?: number | null
    isActive?: boolean
    createdAt?: Date | string
  }

  export type DailyChallengeCreateOrConnectWithoutAnswersInput = {
    where: DailyChallengeWhereUniqueInput
    create: XOR<DailyChallengeCreateWithoutAnswersInput, DailyChallengeUncheckedCreateWithoutAnswersInput>
  }

  export type UserCreateWithoutDailyChallengeAnswersInput = {
    id?: string
    email: string
    username: string
    firstName: string
    lastName: string
    phone?: string | null
    avatar?: string | null
    status?: $Enums.UserStatus
    totalScore?: number
    gamesPlayed?: number
    gamesWon?: number
    winRate?: number
    currentStreak?: number
    bestStreak?: number
    lastActive?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: UserSessionCreateNestedManyWithoutUserInput
    passwordResetTokens?: PasswordResetTokenCreateNestedManyWithoutUserInput
    sentFriendRequests?: FriendshipCreateNestedManyWithoutRequesterInput
    receivedFriendRequests?: FriendshipCreateNestedManyWithoutReceiverInput
    gameParticipations?: GameParticipantCreateNestedManyWithoutUserInput
    leaderboardEntry?: LeaderboardCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutDailyChallengeAnswersInput = {
    id?: string
    email: string
    username: string
    firstName: string
    lastName: string
    phone?: string | null
    avatar?: string | null
    status?: $Enums.UserStatus
    totalScore?: number
    gamesPlayed?: number
    gamesWon?: number
    winRate?: number
    currentStreak?: number
    bestStreak?: number
    lastActive?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: UserSessionUncheckedCreateNestedManyWithoutUserInput
    passwordResetTokens?: PasswordResetTokenUncheckedCreateNestedManyWithoutUserInput
    sentFriendRequests?: FriendshipUncheckedCreateNestedManyWithoutRequesterInput
    receivedFriendRequests?: FriendshipUncheckedCreateNestedManyWithoutReceiverInput
    gameParticipations?: GameParticipantUncheckedCreateNestedManyWithoutUserInput
    leaderboardEntry?: LeaderboardUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutDailyChallengeAnswersInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutDailyChallengeAnswersInput, UserUncheckedCreateWithoutDailyChallengeAnswersInput>
  }

  export type DailyChallengeUpsertWithoutAnswersInput = {
    update: XOR<DailyChallengeUpdateWithoutAnswersInput, DailyChallengeUncheckedUpdateWithoutAnswersInput>
    create: XOR<DailyChallengeCreateWithoutAnswersInput, DailyChallengeUncheckedCreateWithoutAnswersInput>
    where?: DailyChallengeWhereInput
  }

  export type DailyChallengeUpdateToOneWithWhereWithoutAnswersInput = {
    where?: DailyChallengeWhereInput
    data: XOR<DailyChallengeUpdateWithoutAnswersInput, DailyChallengeUncheckedUpdateWithoutAnswersInput>
  }

  export type DailyChallengeUpdateWithoutAnswersInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    verse?: StringFieldUpdateOperationsInput | string
    blanks?: JsonNullValueInput | InputJsonValue
    emojiMapping?: JsonNullValueInput | InputJsonValue
    correctBook?: StringFieldUpdateOperationsInput | string
    correctRef?: StringFieldUpdateOperationsInput | string
    context?: NullableStringFieldUpdateOperationsInput | string | null
    difficulty?: StringFieldUpdateOperationsInput | string
    maxAttempts?: IntFieldUpdateOperationsInput | number
    timeLimit?: NullableIntFieldUpdateOperationsInput | number | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DailyChallengeUncheckedUpdateWithoutAnswersInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    verse?: StringFieldUpdateOperationsInput | string
    blanks?: JsonNullValueInput | InputJsonValue
    emojiMapping?: JsonNullValueInput | InputJsonValue
    correctBook?: StringFieldUpdateOperationsInput | string
    correctRef?: StringFieldUpdateOperationsInput | string
    context?: NullableStringFieldUpdateOperationsInput | string | null
    difficulty?: StringFieldUpdateOperationsInput | string
    maxAttempts?: IntFieldUpdateOperationsInput | number
    timeLimit?: NullableIntFieldUpdateOperationsInput | number | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUpsertWithoutDailyChallengeAnswersInput = {
    update: XOR<UserUpdateWithoutDailyChallengeAnswersInput, UserUncheckedUpdateWithoutDailyChallengeAnswersInput>
    create: XOR<UserCreateWithoutDailyChallengeAnswersInput, UserUncheckedCreateWithoutDailyChallengeAnswersInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutDailyChallengeAnswersInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutDailyChallengeAnswersInput, UserUncheckedUpdateWithoutDailyChallengeAnswersInput>
  }

  export type UserUpdateWithoutDailyChallengeAnswersInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    totalScore?: IntFieldUpdateOperationsInput | number
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    gamesWon?: IntFieldUpdateOperationsInput | number
    winRate?: FloatFieldUpdateOperationsInput | number
    currentStreak?: IntFieldUpdateOperationsInput | number
    bestStreak?: IntFieldUpdateOperationsInput | number
    lastActive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: UserSessionUpdateManyWithoutUserNestedInput
    passwordResetTokens?: PasswordResetTokenUpdateManyWithoutUserNestedInput
    sentFriendRequests?: FriendshipUpdateManyWithoutRequesterNestedInput
    receivedFriendRequests?: FriendshipUpdateManyWithoutReceiverNestedInput
    gameParticipations?: GameParticipantUpdateManyWithoutUserNestedInput
    leaderboardEntry?: LeaderboardUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutDailyChallengeAnswersInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    totalScore?: IntFieldUpdateOperationsInput | number
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    gamesWon?: IntFieldUpdateOperationsInput | number
    winRate?: FloatFieldUpdateOperationsInput | number
    currentStreak?: IntFieldUpdateOperationsInput | number
    bestStreak?: IntFieldUpdateOperationsInput | number
    lastActive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: UserSessionUncheckedUpdateManyWithoutUserNestedInput
    passwordResetTokens?: PasswordResetTokenUncheckedUpdateManyWithoutUserNestedInput
    sentFriendRequests?: FriendshipUncheckedUpdateManyWithoutRequesterNestedInput
    receivedFriendRequests?: FriendshipUncheckedUpdateManyWithoutReceiverNestedInput
    gameParticipations?: GameParticipantUncheckedUpdateManyWithoutUserNestedInput
    leaderboardEntry?: LeaderboardUncheckedUpdateOneWithoutUserNestedInput
  }

  export type UserCreateWithoutLeaderboardEntryInput = {
    id?: string
    email: string
    username: string
    firstName: string
    lastName: string
    phone?: string | null
    avatar?: string | null
    status?: $Enums.UserStatus
    totalScore?: number
    gamesPlayed?: number
    gamesWon?: number
    winRate?: number
    currentStreak?: number
    bestStreak?: number
    lastActive?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: UserSessionCreateNestedManyWithoutUserInput
    passwordResetTokens?: PasswordResetTokenCreateNestedManyWithoutUserInput
    sentFriendRequests?: FriendshipCreateNestedManyWithoutRequesterInput
    receivedFriendRequests?: FriendshipCreateNestedManyWithoutReceiverInput
    gameParticipations?: GameParticipantCreateNestedManyWithoutUserInput
    dailyChallengeAnswers?: DailyChallengeAnswerCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutLeaderboardEntryInput = {
    id?: string
    email: string
    username: string
    firstName: string
    lastName: string
    phone?: string | null
    avatar?: string | null
    status?: $Enums.UserStatus
    totalScore?: number
    gamesPlayed?: number
    gamesWon?: number
    winRate?: number
    currentStreak?: number
    bestStreak?: number
    lastActive?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: UserSessionUncheckedCreateNestedManyWithoutUserInput
    passwordResetTokens?: PasswordResetTokenUncheckedCreateNestedManyWithoutUserInput
    sentFriendRequests?: FriendshipUncheckedCreateNestedManyWithoutRequesterInput
    receivedFriendRequests?: FriendshipUncheckedCreateNestedManyWithoutReceiverInput
    gameParticipations?: GameParticipantUncheckedCreateNestedManyWithoutUserInput
    dailyChallengeAnswers?: DailyChallengeAnswerUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutLeaderboardEntryInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutLeaderboardEntryInput, UserUncheckedCreateWithoutLeaderboardEntryInput>
  }

  export type UserUpsertWithoutLeaderboardEntryInput = {
    update: XOR<UserUpdateWithoutLeaderboardEntryInput, UserUncheckedUpdateWithoutLeaderboardEntryInput>
    create: XOR<UserCreateWithoutLeaderboardEntryInput, UserUncheckedCreateWithoutLeaderboardEntryInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutLeaderboardEntryInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutLeaderboardEntryInput, UserUncheckedUpdateWithoutLeaderboardEntryInput>
  }

  export type UserUpdateWithoutLeaderboardEntryInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    totalScore?: IntFieldUpdateOperationsInput | number
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    gamesWon?: IntFieldUpdateOperationsInput | number
    winRate?: FloatFieldUpdateOperationsInput | number
    currentStreak?: IntFieldUpdateOperationsInput | number
    bestStreak?: IntFieldUpdateOperationsInput | number
    lastActive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: UserSessionUpdateManyWithoutUserNestedInput
    passwordResetTokens?: PasswordResetTokenUpdateManyWithoutUserNestedInput
    sentFriendRequests?: FriendshipUpdateManyWithoutRequesterNestedInput
    receivedFriendRequests?: FriendshipUpdateManyWithoutReceiverNestedInput
    gameParticipations?: GameParticipantUpdateManyWithoutUserNestedInput
    dailyChallengeAnswers?: DailyChallengeAnswerUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutLeaderboardEntryInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus
    totalScore?: IntFieldUpdateOperationsInput | number
    gamesPlayed?: IntFieldUpdateOperationsInput | number
    gamesWon?: IntFieldUpdateOperationsInput | number
    winRate?: FloatFieldUpdateOperationsInput | number
    currentStreak?: IntFieldUpdateOperationsInput | number
    bestStreak?: IntFieldUpdateOperationsInput | number
    lastActive?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: UserSessionUncheckedUpdateManyWithoutUserNestedInput
    passwordResetTokens?: PasswordResetTokenUncheckedUpdateManyWithoutUserNestedInput
    sentFriendRequests?: FriendshipUncheckedUpdateManyWithoutRequesterNestedInput
    receivedFriendRequests?: FriendshipUncheckedUpdateManyWithoutReceiverNestedInput
    gameParticipations?: GameParticipantUncheckedUpdateManyWithoutUserNestedInput
    dailyChallengeAnswers?: DailyChallengeAnswerUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserSessionCreateManyUserInput = {
    id?: string
    sessionToken: string
    deviceInfo?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    userAgent?: string | null
    status?: $Enums.SessionStatus
    createdAt?: Date | string
    expiresAt: Date | string
    lastActivity?: Date | string
  }

  export type PasswordResetTokenCreateManyUserInput = {
    id?: string
    token: string
    expiresAt: Date | string
    used?: boolean
    createdAt?: Date | string
    usedAt?: Date | string | null
  }

  export type FriendshipCreateManyRequesterInput = {
    id?: string
    receiverId: string
    status?: $Enums.FriendshipStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FriendshipCreateManyReceiverInput = {
    id?: string
    requesterId: string
    status?: $Enums.FriendshipStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GameParticipantCreateManyUserInput = {
    id?: string
    gameSessionId: string
    position?: number
    isReady?: boolean
    isConnected?: boolean
    finalScore?: number
    finalRank?: number | null
    mistakeCount?: number
    joinedAt?: Date | string
    leftAt?: Date | string | null
  }

  export type DailyChallengeAnswerCreateManyUserInput = {
    id?: string
    challengeId: string
    userAnswers: JsonNullValueInput | InputJsonValue
    isCorrect?: boolean
    score?: number
    timeSpent: number
    hintsUsed?: number
    completedAt?: Date | string
  }

  export type UserSessionUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    deviceInfo?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActivity?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSessionUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    deviceInfo?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActivity?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserSessionUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    sessionToken?: StringFieldUpdateOperationsInput | string
    deviceInfo?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSessionStatusFieldUpdateOperationsInput | $Enums.SessionStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActivity?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PasswordResetTokenUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    used?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PasswordResetTokenUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    used?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PasswordResetTokenUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    token?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    used?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    usedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type FriendshipUpdateWithoutRequesterInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendshipStatusFieldUpdateOperationsInput | $Enums.FriendshipStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    receiver?: UserUpdateOneRequiredWithoutReceivedFriendRequestsNestedInput
  }

  export type FriendshipUncheckedUpdateWithoutRequesterInput = {
    id?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendshipStatusFieldUpdateOperationsInput | $Enums.FriendshipStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FriendshipUncheckedUpdateManyWithoutRequesterInput = {
    id?: StringFieldUpdateOperationsInput | string
    receiverId?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendshipStatusFieldUpdateOperationsInput | $Enums.FriendshipStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FriendshipUpdateWithoutReceiverInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendshipStatusFieldUpdateOperationsInput | $Enums.FriendshipStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requester?: UserUpdateOneRequiredWithoutSentFriendRequestsNestedInput
  }

  export type FriendshipUncheckedUpdateWithoutReceiverInput = {
    id?: StringFieldUpdateOperationsInput | string
    requesterId?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendshipStatusFieldUpdateOperationsInput | $Enums.FriendshipStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FriendshipUncheckedUpdateManyWithoutReceiverInput = {
    id?: StringFieldUpdateOperationsInput | string
    requesterId?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendshipStatusFieldUpdateOperationsInput | $Enums.FriendshipStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameParticipantUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    isReady?: BoolFieldUpdateOperationsInput | boolean
    isConnected?: BoolFieldUpdateOperationsInput | boolean
    finalScore?: IntFieldUpdateOperationsInput | number
    finalRank?: NullableIntFieldUpdateOperationsInput | number | null
    mistakeCount?: IntFieldUpdateOperationsInput | number
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    gameSession?: GameSessionUpdateOneRequiredWithoutParticipantsNestedInput
    scores?: GameScoreUpdateManyWithoutParticipantNestedInput
  }

  export type GameParticipantUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    gameSessionId?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    isReady?: BoolFieldUpdateOperationsInput | boolean
    isConnected?: BoolFieldUpdateOperationsInput | boolean
    finalScore?: IntFieldUpdateOperationsInput | number
    finalRank?: NullableIntFieldUpdateOperationsInput | number | null
    mistakeCount?: IntFieldUpdateOperationsInput | number
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scores?: GameScoreUncheckedUpdateManyWithoutParticipantNestedInput
  }

  export type GameParticipantUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    gameSessionId?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    isReady?: BoolFieldUpdateOperationsInput | boolean
    isConnected?: BoolFieldUpdateOperationsInput | boolean
    finalScore?: IntFieldUpdateOperationsInput | number
    finalRank?: NullableIntFieldUpdateOperationsInput | number | null
    mistakeCount?: IntFieldUpdateOperationsInput | number
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type DailyChallengeAnswerUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    userAnswers?: JsonNullValueInput | InputJsonValue
    isCorrect?: BoolFieldUpdateOperationsInput | boolean
    score?: IntFieldUpdateOperationsInput | number
    timeSpent?: IntFieldUpdateOperationsInput | number
    hintsUsed?: IntFieldUpdateOperationsInput | number
    completedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    challenge?: DailyChallengeUpdateOneRequiredWithoutAnswersNestedInput
  }

  export type DailyChallengeAnswerUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    challengeId?: StringFieldUpdateOperationsInput | string
    userAnswers?: JsonNullValueInput | InputJsonValue
    isCorrect?: BoolFieldUpdateOperationsInput | boolean
    score?: IntFieldUpdateOperationsInput | number
    timeSpent?: IntFieldUpdateOperationsInput | number
    hintsUsed?: IntFieldUpdateOperationsInput | number
    completedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DailyChallengeAnswerUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    challengeId?: StringFieldUpdateOperationsInput | string
    userAnswers?: JsonNullValueInput | InputJsonValue
    isCorrect?: BoolFieldUpdateOperationsInput | boolean
    score?: IntFieldUpdateOperationsInput | number
    timeSpent?: IntFieldUpdateOperationsInput | number
    hintsUsed?: IntFieldUpdateOperationsInput | number
    completedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameParticipantCreateManyGameSessionInput = {
    id?: string
    userId: string
    position?: number
    isReady?: boolean
    isConnected?: boolean
    finalScore?: number
    finalRank?: number | null
    mistakeCount?: number
    joinedAt?: Date | string
    leftAt?: Date | string | null
  }

  export type GameRoundCreateManyGameSessionInput = {
    id?: string
    roundNumber: number
    verse: string
    blanks: JsonNullValueInput | InputJsonValue
    emojiMapping: JsonNullValueInput | InputJsonValue
    correctBook: string
    correctRef: string
    context?: string | null
    startedAt?: Date | string | null
    endedAt?: Date | string | null
  }

  export type GameParticipantUpdateWithoutGameSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    isReady?: BoolFieldUpdateOperationsInput | boolean
    isConnected?: BoolFieldUpdateOperationsInput | boolean
    finalScore?: IntFieldUpdateOperationsInput | number
    finalRank?: NullableIntFieldUpdateOperationsInput | number | null
    mistakeCount?: IntFieldUpdateOperationsInput | number
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutGameParticipationsNestedInput
    scores?: GameScoreUpdateManyWithoutParticipantNestedInput
  }

  export type GameParticipantUncheckedUpdateWithoutGameSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    isReady?: BoolFieldUpdateOperationsInput | boolean
    isConnected?: BoolFieldUpdateOperationsInput | boolean
    finalScore?: IntFieldUpdateOperationsInput | number
    finalRank?: NullableIntFieldUpdateOperationsInput | number | null
    mistakeCount?: IntFieldUpdateOperationsInput | number
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scores?: GameScoreUncheckedUpdateManyWithoutParticipantNestedInput
  }

  export type GameParticipantUncheckedUpdateManyWithoutGameSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    position?: IntFieldUpdateOperationsInput | number
    isReady?: BoolFieldUpdateOperationsInput | boolean
    isConnected?: BoolFieldUpdateOperationsInput | boolean
    finalScore?: IntFieldUpdateOperationsInput | number
    finalRank?: NullableIntFieldUpdateOperationsInput | number | null
    mistakeCount?: IntFieldUpdateOperationsInput | number
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    leftAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GameRoundUpdateWithoutGameSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    roundNumber?: IntFieldUpdateOperationsInput | number
    verse?: StringFieldUpdateOperationsInput | string
    blanks?: JsonNullValueInput | InputJsonValue
    emojiMapping?: JsonNullValueInput | InputJsonValue
    correctBook?: StringFieldUpdateOperationsInput | string
    correctRef?: StringFieldUpdateOperationsInput | string
    context?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scores?: GameScoreUpdateManyWithoutRoundNestedInput
  }

  export type GameRoundUncheckedUpdateWithoutGameSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    roundNumber?: IntFieldUpdateOperationsInput | number
    verse?: StringFieldUpdateOperationsInput | string
    blanks?: JsonNullValueInput | InputJsonValue
    emojiMapping?: JsonNullValueInput | InputJsonValue
    correctBook?: StringFieldUpdateOperationsInput | string
    correctRef?: StringFieldUpdateOperationsInput | string
    context?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    scores?: GameScoreUncheckedUpdateManyWithoutRoundNestedInput
  }

  export type GameRoundUncheckedUpdateManyWithoutGameSessionInput = {
    id?: StringFieldUpdateOperationsInput | string
    roundNumber?: IntFieldUpdateOperationsInput | number
    verse?: StringFieldUpdateOperationsInput | string
    blanks?: JsonNullValueInput | InputJsonValue
    emojiMapping?: JsonNullValueInput | InputJsonValue
    correctBook?: StringFieldUpdateOperationsInput | string
    correctRef?: StringFieldUpdateOperationsInput | string
    context?: NullableStringFieldUpdateOperationsInput | string | null
    startedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GameScoreCreateManyParticipantInput = {
    id?: string
    roundId: string
    blanksScore?: number
    contextScore?: number
    bookScore?: number
    referenceScore?: number
    timeBonus?: number
    streakBonus?: number
    totalScore?: number
    timeSpent: number
    mistakesMade?: number
    hintsUsed?: number
    createdAt?: Date | string
  }

  export type GameScoreUpdateWithoutParticipantInput = {
    id?: StringFieldUpdateOperationsInput | string
    blanksScore?: IntFieldUpdateOperationsInput | number
    contextScore?: IntFieldUpdateOperationsInput | number
    bookScore?: IntFieldUpdateOperationsInput | number
    referenceScore?: IntFieldUpdateOperationsInput | number
    timeBonus?: IntFieldUpdateOperationsInput | number
    streakBonus?: IntFieldUpdateOperationsInput | number
    totalScore?: IntFieldUpdateOperationsInput | number
    timeSpent?: IntFieldUpdateOperationsInput | number
    mistakesMade?: IntFieldUpdateOperationsInput | number
    hintsUsed?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    round?: GameRoundUpdateOneRequiredWithoutScoresNestedInput
  }

  export type GameScoreUncheckedUpdateWithoutParticipantInput = {
    id?: StringFieldUpdateOperationsInput | string
    roundId?: StringFieldUpdateOperationsInput | string
    blanksScore?: IntFieldUpdateOperationsInput | number
    contextScore?: IntFieldUpdateOperationsInput | number
    bookScore?: IntFieldUpdateOperationsInput | number
    referenceScore?: IntFieldUpdateOperationsInput | number
    timeBonus?: IntFieldUpdateOperationsInput | number
    streakBonus?: IntFieldUpdateOperationsInput | number
    totalScore?: IntFieldUpdateOperationsInput | number
    timeSpent?: IntFieldUpdateOperationsInput | number
    mistakesMade?: IntFieldUpdateOperationsInput | number
    hintsUsed?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameScoreUncheckedUpdateManyWithoutParticipantInput = {
    id?: StringFieldUpdateOperationsInput | string
    roundId?: StringFieldUpdateOperationsInput | string
    blanksScore?: IntFieldUpdateOperationsInput | number
    contextScore?: IntFieldUpdateOperationsInput | number
    bookScore?: IntFieldUpdateOperationsInput | number
    referenceScore?: IntFieldUpdateOperationsInput | number
    timeBonus?: IntFieldUpdateOperationsInput | number
    streakBonus?: IntFieldUpdateOperationsInput | number
    totalScore?: IntFieldUpdateOperationsInput | number
    timeSpent?: IntFieldUpdateOperationsInput | number
    mistakesMade?: IntFieldUpdateOperationsInput | number
    hintsUsed?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameScoreCreateManyRoundInput = {
    id?: string
    participantId: string
    blanksScore?: number
    contextScore?: number
    bookScore?: number
    referenceScore?: number
    timeBonus?: number
    streakBonus?: number
    totalScore?: number
    timeSpent: number
    mistakesMade?: number
    hintsUsed?: number
    createdAt?: Date | string
  }

  export type GameScoreUpdateWithoutRoundInput = {
    id?: StringFieldUpdateOperationsInput | string
    blanksScore?: IntFieldUpdateOperationsInput | number
    contextScore?: IntFieldUpdateOperationsInput | number
    bookScore?: IntFieldUpdateOperationsInput | number
    referenceScore?: IntFieldUpdateOperationsInput | number
    timeBonus?: IntFieldUpdateOperationsInput | number
    streakBonus?: IntFieldUpdateOperationsInput | number
    totalScore?: IntFieldUpdateOperationsInput | number
    timeSpent?: IntFieldUpdateOperationsInput | number
    mistakesMade?: IntFieldUpdateOperationsInput | number
    hintsUsed?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    participant?: GameParticipantUpdateOneRequiredWithoutScoresNestedInput
  }

  export type GameScoreUncheckedUpdateWithoutRoundInput = {
    id?: StringFieldUpdateOperationsInput | string
    participantId?: StringFieldUpdateOperationsInput | string
    blanksScore?: IntFieldUpdateOperationsInput | number
    contextScore?: IntFieldUpdateOperationsInput | number
    bookScore?: IntFieldUpdateOperationsInput | number
    referenceScore?: IntFieldUpdateOperationsInput | number
    timeBonus?: IntFieldUpdateOperationsInput | number
    streakBonus?: IntFieldUpdateOperationsInput | number
    totalScore?: IntFieldUpdateOperationsInput | number
    timeSpent?: IntFieldUpdateOperationsInput | number
    mistakesMade?: IntFieldUpdateOperationsInput | number
    hintsUsed?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GameScoreUncheckedUpdateManyWithoutRoundInput = {
    id?: StringFieldUpdateOperationsInput | string
    participantId?: StringFieldUpdateOperationsInput | string
    blanksScore?: IntFieldUpdateOperationsInput | number
    contextScore?: IntFieldUpdateOperationsInput | number
    bookScore?: IntFieldUpdateOperationsInput | number
    referenceScore?: IntFieldUpdateOperationsInput | number
    timeBonus?: IntFieldUpdateOperationsInput | number
    streakBonus?: IntFieldUpdateOperationsInput | number
    totalScore?: IntFieldUpdateOperationsInput | number
    timeSpent?: IntFieldUpdateOperationsInput | number
    mistakesMade?: IntFieldUpdateOperationsInput | number
    hintsUsed?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DailyChallengeAnswerCreateManyChallengeInput = {
    id?: string
    userId: string
    userAnswers: JsonNullValueInput | InputJsonValue
    isCorrect?: boolean
    score?: number
    timeSpent: number
    hintsUsed?: number
    completedAt?: Date | string
  }

  export type DailyChallengeAnswerUpdateWithoutChallengeInput = {
    id?: StringFieldUpdateOperationsInput | string
    userAnswers?: JsonNullValueInput | InputJsonValue
    isCorrect?: BoolFieldUpdateOperationsInput | boolean
    score?: IntFieldUpdateOperationsInput | number
    timeSpent?: IntFieldUpdateOperationsInput | number
    hintsUsed?: IntFieldUpdateOperationsInput | number
    completedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutDailyChallengeAnswersNestedInput
  }

  export type DailyChallengeAnswerUncheckedUpdateWithoutChallengeInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userAnswers?: JsonNullValueInput | InputJsonValue
    isCorrect?: BoolFieldUpdateOperationsInput | boolean
    score?: IntFieldUpdateOperationsInput | number
    timeSpent?: IntFieldUpdateOperationsInput | number
    hintsUsed?: IntFieldUpdateOperationsInput | number
    completedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DailyChallengeAnswerUncheckedUpdateManyWithoutChallengeInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    userAnswers?: JsonNullValueInput | InputJsonValue
    isCorrect?: BoolFieldUpdateOperationsInput | boolean
    score?: IntFieldUpdateOperationsInput | number
    timeSpent?: IntFieldUpdateOperationsInput | number
    hintsUsed?: IntFieldUpdateOperationsInput | number
    completedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}