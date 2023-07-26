import { Context, Effect, Match } from "effect";

import * as UserServiceLive from "~/user";

const UserService = Context.Tag<typeof import("~/user")>();

const getUserName = (id: string) =>
	Effect.Do.pipe(
		Effect.bind("userService", () => UserService),
		Effect.flatMap(({ userService }) => userService.getUser(id).pipe(Effect.map(({ username }) => username))),
	);

await Effect.runPromise(
	Effect.all([
		getUserName("test123").pipe(
			Effect.provideService(UserService, UserServiceLive),
			Effect.matchEffect({
				onFailure: ({ _tag }) => Effect.log(`Fetching username errored with a tag ${_tag}`),
				onSuccess: username => Effect.log(`Fetching username succeeded - ${username}`),
			}),
		),
		getUserName("5678").pipe(
			Effect.provideService(UserService, UserServiceLive),
			Effect.matchEffect({
				onFailure: ({ _tag }) => Effect.log(`Fetching username errored with a tag ${_tag}`),
				onSuccess: username => Effect.log(`Fetching username succeeded - ${username}`),
			}),
		),
		getUserName("UUID81238123").pipe(
			Effect.provideService(UserService, {
				getUser: () =>
					Effect.succeed({ id: "SOME_MOCK_DATA", username: "Jon Test Snow" }).pipe(
						Effect.tap(() => Effect.sleep("6 seconds")),
					),
			}),
			Effect.matchEffect({
				onFailure: ({ _tag }) => Effect.log(`Fetching username errored with a tag ${_tag}`),
				onSuccess: username => Effect.log(`Fetching username succeeded - ${username}`),
			}),
		),
		getUserName("UUID81238123").pipe(
			Effect.provideService(UserService, {
				getUser: () => Effect.fail({ _tag: "MISSING_USER" } as const).pipe(Effect.tap(() => Effect.sleep("6 seconds"))),
			}),
			Effect.matchEffect({
				onFailure: ({ _tag }) => Effect.log(`Fetching username errored with a tag ${_tag}`),
				onSuccess: username => Effect.log(`Fetching username succeeded - ${username}`),
			}),
		),
	]),
);

Effect.log("Finished").pipe(Effect.runSync);

declare const authState:
	| { data: { state: Record<string, unknown> }; status: "anonymous" }
	| { data: { userId: string }; status: "loggedIn" }
	| { rights: Array<string>; status: "admin" };

const someState = Match.value(authState).pipe(
	Match.discriminator("status")("admin", ({ status }) => status),
	Match.orElse(() => "not logged in as admin" as const),
);
