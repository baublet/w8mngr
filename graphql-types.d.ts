import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
};

export type FoodEntry = {
   __typename?: 'FoodEntry',
  id: Scalars['ID'],
  description?: Maybe<Scalars['String']>,
  calories?: Maybe<Scalars['Int']>,
  fat?: Maybe<Scalars['Int']>,
  carbs?: Maybe<Scalars['Int']>,
  protein?: Maybe<Scalars['Int']>,
  day: Scalars['Int'],
  userId: Scalars['Float'],
  createdAt: Scalars['Float'],
  updatedAt: Scalars['Float'],
};

export type FoodEntryConnection = {
   __typename?: 'FoodEntryConnection',
  totalCount?: Maybe<Scalars['Int']>,
  nodes?: Maybe<Array<Maybe<FoodEntry>>>,
};

export type FoodLog = {
   __typename?: 'FoodLog',
  day: Scalars['Int'],
  calories: Scalars['Int'],
  fat: Scalars['Int'],
  carbs: Scalars['Int'],
  protein: Scalars['Int'],
  entries: FoodEntryConnection,
};

export type Query = {
   __typename?: 'Query',
  currentUser?: Maybe<User>,
};

export type User = {
   __typename?: 'User',
  id: Scalars['ID'],
  name: Scalars['String'],
  email: Scalars['String'],
  foodLog?: Maybe<FoodLog>,
};



export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;


export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: ResolverTypeWrapper<{}>,
  User: ResolverTypeWrapper<User>,
  ID: ResolverTypeWrapper<Scalars['ID']>,
  String: ResolverTypeWrapper<Scalars['String']>,
  FoodLog: ResolverTypeWrapper<FoodLog>,
  Int: ResolverTypeWrapper<Scalars['Int']>,
  FoodEntryConnection: ResolverTypeWrapper<FoodEntryConnection>,
  FoodEntry: ResolverTypeWrapper<FoodEntry>,
  Float: ResolverTypeWrapper<Scalars['Float']>,
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>,
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Query: {},
  User: User,
  ID: Scalars['ID'],
  String: Scalars['String'],
  FoodLog: FoodLog,
  Int: Scalars['Int'],
  FoodEntryConnection: FoodEntryConnection,
  FoodEntry: FoodEntry,
  Float: Scalars['Float'],
  Boolean: Scalars['Boolean'],
};

export type FoodEntryResolvers<ContextType = any, ParentType extends ResolversParentTypes['FoodEntry'] = ResolversParentTypes['FoodEntry']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>,
  calories?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  fat?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  carbs?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  protein?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  day?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  userId?: Resolver<ResolversTypes['Float'], ParentType, ContextType>,
  createdAt?: Resolver<ResolversTypes['Float'], ParentType, ContextType>,
  updatedAt?: Resolver<ResolversTypes['Float'], ParentType, ContextType>,
};

export type FoodEntryConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['FoodEntryConnection'] = ResolversParentTypes['FoodEntryConnection']> = {
  totalCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>,
  nodes?: Resolver<Maybe<Array<Maybe<ResolversTypes['FoodEntry']>>>, ParentType, ContextType>,
};

export type FoodLogResolvers<ContextType = any, ParentType extends ResolversParentTypes['FoodLog'] = ResolversParentTypes['FoodLog']> = {
  day?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  calories?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  fat?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  carbs?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  protein?: Resolver<ResolversTypes['Int'], ParentType, ContextType>,
  entries?: Resolver<ResolversTypes['FoodEntryConnection'], ParentType, ContextType>,
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  currentUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>,
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>,
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>,
  foodLog?: Resolver<Maybe<ResolversTypes['FoodLog']>, ParentType, ContextType>,
};

export type Resolvers<ContextType = any> = {
  FoodEntry?: FoodEntryResolvers<ContextType>,
  FoodEntryConnection?: FoodEntryConnectionResolvers<ContextType>,
  FoodLog?: FoodLogResolvers<ContextType>,
  Query?: QueryResolvers<ContextType>,
  User?: UserResolvers<ContextType>,
};


/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
*/
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
