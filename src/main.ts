import { Context, Effect } from "effect";

import * as UserServiceLive from "~/user";

const UserService = Context.Tag<typeof import("~/user")>();

const getUserNameProgram = Effect.Do.pipe(
	Effect.bind("userService", () => UserService),
	Effect.flatMap(({ userService }) => userService.getUser("test123").pipe(Effect.map(({ username }) => username))),
);

const contextWithUserService = Context.empty().pipe(Context.add(UserService, UserServiceLive));

await Effect.provideContext(getUserNameProgram, contextWithUserService).pipe(
	Effect.matchEffect({
		onFailure: ({ _tag }) => Effect.log(`Fetching username errored with a tag ${_tag}`),
		onSuccess: username => Effect.log(`Fetching username succeeded - ${username}`),
	}),
	Effect.runPromise,
);

Effect.log("Finished").pipe(Effect.runSync);
