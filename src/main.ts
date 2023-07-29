import { Cause, Effect, Exit, Option } from "effect";

import { Database, DatabaseLive } from "~/database";
import { UserService, UserServiceLive } from "~/user";

const program = UserService.pipe(
	Effect.flatMap(userService => userService.getUserName("t")),
	Effect.tap(userName => Effect.log(userName)),
	Effect.provideService(UserService, UserServiceLive),
	Effect.provideService(Database, DatabaseLive),
);

const result = Effect.runSyncExit(program);

if (Exit.isSuccess(result)) {
	console.log("yaaay");
	console.log(result.value);
} else {
	console.log("naay");
	const { _tag } = Cause.failureOption(result.cause).pipe(Option.getOrThrow);

	console.log(_tag);
}
