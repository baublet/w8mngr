import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type FoodEntry = {
  __typename?: 'FoodEntry';
  calories?: Maybe<Scalars['Int']>;
  carbs?: Maybe<Scalars['Int']>;
  createdAt: Scalars['Float'];
  day: Scalars['Int'];
  description?: Maybe<Scalars['String']>;
  fat?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  protein?: Maybe<Scalars['Int']>;
  updatedAt: Scalars['Float'];
  userId: Scalars['Float'];
};

export type FoodEntryConnection = {
  __typename?: 'FoodEntryConnection';
  nodes?: Maybe<Array<Maybe<FoodEntry>>>;
  pageInfo?: Maybe<Scalars['Int']>;
};

export type FoodLog = {
  __typename?: 'FoodLog';
  calories: Scalars['Int'];
  carbs: Scalars['Int'];
  day: Scalars['Int'];
  entries: FoodEntryConnection;
  fat: Scalars['Int'];
  protein: Scalars['Int'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  hasNextPage: Scalars['Boolean'];
  hasPreviousPage: Scalars['Boolean'];
  totalCount: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  currentUser?: Maybe<User>;
};

export type User = {
  __typename?: 'User';
  email: Scalars['String'];
  foodLog?: Maybe<FoodLog>;
  id: Scalars['ID'];
  name: Scalars['String'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

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
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

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
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  FoodEntry: ResolverTypeWrapper<FoodEntry>;
  FoodEntryConnection: ResolverTypeWrapper<FoodEntryConnection>;
  FoodLog: ResolverTypeWrapper<FoodLog>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  User: ResolverTypeWrapper<User>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  Float: Scalars['Float'];
  FoodEntry: FoodEntry;
  FoodEntryConnection: FoodEntryConnection;
  FoodLog: FoodLog;
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  PageInfo: PageInfo;
  Query: {};
  String: Scalars['String'];
  User: User;
};

export type FoodEntryResolvers<ContextType = any, ParentType extends ResolversParentTypes['FoodEntry'] = ResolversParentTypes['FoodEntry']> = {
  calories?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  carbs?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  day?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  fat?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  protein?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FoodEntryConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['FoodEntryConnection'] = ResolversParentTypes['FoodEntryConnection']> = {
  nodes?: Resolver<Maybe<Array<Maybe<ResolversTypes['FoodEntry']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FoodLogResolvers<ContextType = any, ParentType extends ResolversParentTypes['FoodLog'] = ResolversParentTypes['FoodLog']> = {
  calories?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  carbs?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  day?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  entries?: Resolver<ResolversTypes['FoodEntryConnection'], ParentType, ContextType>;
  fat?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  protein?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = {
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  currentUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  foodLog?: Resolver<Maybe<ResolversTypes['FoodLog']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  FoodEntry?: FoodEntryResolvers<ContextType>;
  FoodEntryConnection?: FoodEntryConnectionResolvers<ContextType>;
  FoodLog?: FoodLogResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

