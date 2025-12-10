import { CreatePublicMovieListData, CreatePublicMovieListVariables, GetMyPrivateMovieListsData, AddMovieToListData, AddMovieToListVariables, DeleteMyReviewData, DeleteMyReviewVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreatePublicMovieList(options?: useDataConnectMutationOptions<CreatePublicMovieListData, FirebaseError, CreatePublicMovieListVariables>): UseDataConnectMutationResult<CreatePublicMovieListData, CreatePublicMovieListVariables>;
export function useCreatePublicMovieList(dc: DataConnect, options?: useDataConnectMutationOptions<CreatePublicMovieListData, FirebaseError, CreatePublicMovieListVariables>): UseDataConnectMutationResult<CreatePublicMovieListData, CreatePublicMovieListVariables>;

export function useGetMyPrivateMovieLists(options?: useDataConnectQueryOptions<GetMyPrivateMovieListsData>): UseDataConnectQueryResult<GetMyPrivateMovieListsData, undefined>;
export function useGetMyPrivateMovieLists(dc: DataConnect, options?: useDataConnectQueryOptions<GetMyPrivateMovieListsData>): UseDataConnectQueryResult<GetMyPrivateMovieListsData, undefined>;

export function useAddMovieToList(options?: useDataConnectMutationOptions<AddMovieToListData, FirebaseError, AddMovieToListVariables>): UseDataConnectMutationResult<AddMovieToListData, AddMovieToListVariables>;
export function useAddMovieToList(dc: DataConnect, options?: useDataConnectMutationOptions<AddMovieToListData, FirebaseError, AddMovieToListVariables>): UseDataConnectMutationResult<AddMovieToListData, AddMovieToListVariables>;

export function useDeleteMyReview(options?: useDataConnectMutationOptions<DeleteMyReviewData, FirebaseError, DeleteMyReviewVariables>): UseDataConnectMutationResult<DeleteMyReviewData, DeleteMyReviewVariables>;
export function useDeleteMyReview(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteMyReviewData, FirebaseError, DeleteMyReviewVariables>): UseDataConnectMutationResult<DeleteMyReviewData, DeleteMyReviewVariables>;
