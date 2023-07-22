import { Context, Effect } from "effect";

import * as UserServiceLive from "~/user";

const UserService = Context.Tag<typeof import("~/user")>();

const getUserNameProgram = Effect.Do.pipe(
	Effect.bind("userService", () => UserService),
	Effect.flatMap(({ userService }) => userService.getUser("test123").pipe(Effect.map(({ username }) => username))),
);

await Effect.runPromise(
	Effect.all(
		[
			getUserNameProgram.pipe(
				Effect.provideService(UserService, UserServiceLive),
				Effect.matchEffect({
					onFailure: ({ _tag }) => Effect.log(`Fetching username errored with a tag ${_tag}`),
					onSuccess: username => Effect.log(`Fetching username succeeded - ${username}`),
				}),
			),
			getUserNameProgram.pipe(
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
		],
		{ concurrency: 2 },
	),
);

Effect.log("Finished").pipe(Effect.runSync);
